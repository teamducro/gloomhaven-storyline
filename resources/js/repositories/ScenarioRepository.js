import AchievementRepository from "./AchievementRepository";
import Scenario from "../models/Scenario";
import ScenarioValidator from "../services/ScenarioValidator";
import {ScenarioState} from "../models/ScenarioState";
import Sheet from "../models/Sheet";
import ItemTextParser from "../services/ItemTextParser";
import GameData from "../services/GameData";

export default class ScenarioRepository {
    fetch(game) {
        return collect((new GameData).scenarios(game)).map((scenario) => {
            scenario = new Scenario(scenario);
            this.fetchChapter(scenario, game);
            this.fetchRegions(scenario, game);

            return scenario;
        });
    }

    changeState(scenario, state, shouldValidate = true) {
        if (!isNaN(scenario)) {
            scenario = this.find(scenario);
        }

        const previousState = scenario.state;
        scenario.state = state;

        if (scenario.isComplete()) {
            this.processAchievements(scenario);
            this.processRewardedItems(scenario);
        } else if (previousState === ScenarioState.complete && (scenario.isIncomplete() || scenario.isHidden())) {
            this.undoAchievements(scenario);
            this.processRewardedItems(scenario, false);
        }

        if (scenario.is_side && !scenario.required_by.isEmpty()) {
            if (!scenario.isHidden()) {
                this.processManualAchievements(scenario);
            } else {
                this.undoManualAchievements(scenario);
            }
        }

        if (shouldValidate) {
            this.scenarioValidator.validate();
        }
    }

    setHidden(scenario, shouldValidate = false) {
        this.changeState(scenario, ScenarioState.hidden, shouldValidate);
    }

    setIncomplete(scenario, shouldValidate = false) {
        this.changeState(scenario, ScenarioState.incomplete, shouldValidate);
    }

    setComplete(scenario, shouldValidate = false) {
        this.changeState(scenario, ScenarioState.complete, shouldValidate);
    }

    setBlocked(scenario, shouldValidate = false) {
        this.changeState(scenario, ScenarioState.blocked, shouldValidate);
    }

    setRequired(scenario, shouldValidate = false) {
        this.changeState(scenario, ScenarioState.required, shouldValidate);
    }

    choose(scenario, choice) {
        scenario.state = ScenarioState.complete;
        scenario.choice = choice.id;

        this.scenarioValidator.validate();
    }

    unlockTreasureScenario(scenario, id) {
        if (scenario.treasures_to.has(id)) {
            this.scenarioValidator.validate();

            return true;
        }

        return false;
    }

    isScenarioUnlockedByTreasure(scenario) {
        if (scenario.treasures_from.count()) {
            let scenarios = this.findMany(scenario.treasures_from);
            return scenarios.filter((treasureScenario) => {
                let treasure = treasureScenario.treasures_to.flip().get(scenario.id.toString());
                return treasureScenario.isTreasureUnlocked(treasure);
            }).count() > 0;
        }

        return false;
    }

    processAchievements(scenario) {
        if (scenario.achievements_awarded) {
            scenario.achievements_awarded.each(achievement => {
                this.achievementRepository.gain(achievement);
            })
        }
        if (scenario.achievements_lost) {
            scenario.achievements_lost.each(achievement => {
                this.achievementRepository.lose(achievement);
            })
        }
    }

    undoAchievements(scenario) {
        if (scenario.achievements_lost) {
            scenario.achievements_lost.each(id => {
                this.achievementRepository.gain(id);
            })
        }
        if (scenario.achievements_awarded) {
            scenario.achievements_awarded.each(id => {
                if (this.awardedFrom(id).isEmpty() || this.achievementRepository.find(id).upgrades.length) {
                    this.achievementRepository.remove(id);
                }
            })
        }
    }

    processRewardedItems(scenario, checked = true) {
        const items = scenario.rewardItems();
        this.processItems(items, checked);
    }

    processTreasureItems(scenario, id, checked = true) {
        if (!scenario.treasures.has(id)) {
            return;
        }

        let items = (new ItemTextParser).ids(scenario.treasures.get(id));
        this.processItems(items, checked);
    }

    processItems(items, checked) {
        if (!items.empty) {
            let sheet = new Sheet;
            items.each(item => {
                sheet.itemDesigns[item] = checked;
            });
            sheet.store();
        }
    }

    processManualAchievements(scenario) {
        this.achievementRepository.getManualAchievementsByRequiredScenario(scenario, false)
            .each(achievement => {
                this.achievementRepository.gain(achievement.id);
            });
    }

    undoManualAchievements(scenario) {
        this.achievementRepository.getManualAchievementsByRequiredScenario(scenario, true)
            .each(achievement => {
                this.achievementRepository.remove(achievement.id);
            });
    }

    choice(scenario) {
        return this.findMany(scenario.choices).firstWhere('state', '!=', ScenarioState.hidden);
    }

    find(id) {
        return app.scenarios.firstWhere('id', parseInt(id));
    }

    findMany(list) {
        return collect().wrap(list).map((id) => {
            return this.find(id);
        });
    }

    where(filter) {
        return app.scenarios.filter(filter);
    }

    awardedFrom(achievement) {
        if (typeof achievement === 'string') {
            achievement = this.achievementRepository.find(achievement);
        }

        let baseAchievement = this.achievementRepository
            .where((a) => {
                return a.upgrades.includes(achievement.id);
            })
            .first();
        if (baseAchievement) {
            achievement = baseAchievement;
        }

        return this.where((scenario, key) => {
            return scenario.achievements_awarded
                && scenario.achievements_awarded.contains(achievement.id);
        })
            .where('state', ScenarioState.complete);
    }

    requiredBy(achievement) {
        if (typeof achievement === 'string') {
            achievement = this.achievementRepository.find(achievement);
        }

        return this.where((scenario, key) => {
            if (scenario.required_by.isEmpty()) {
                return false;
            }

            return scenario.required_by.contains((condition) => {
                let complete = condition.complete || [];
                let incomplete = condition.incomplete || [];
                return complete.some((a) => a === achievement.id) || incomplete.some((a) => a === achievement.id);
            });
        })
            .where('state', '!=', ScenarioState.hidden);
    }

    getSideScenarioByManualAchievement(achievement) {
        return this.where((scenario) => {
            return scenario.is_side
                && !scenario.required_by.isEmpty()
                && scenario.required_by.contains((condition) => {
                    let complete = condition.complete || [];
                    return complete.includes(achievement.id);
                })
        }).first();
    }

    fetchChapter(scenario, game) {
        if (scenario.chapter_id) {
            scenario.chapter_name = this.fetchAllChapters(game).firstWhere('id', scenario.chapter_id).name;
        }
    }

    fetchRegions(scenario, game) {
        if (scenario.region_ids.length) {
            scenario.regions = this.fetchAllRegions(game).whereIn('id', scenario.region_ids);
        }
    }

    setQuests(scenarios, quests) {
        scenarios.each(scenario => {
            scenario.quests = quests.whereIn('id', scenario.quests);
        });
    }

    fetchAllChapters(game) {
        return this._chapters || (this._chapters = collect((new GameData).chapters(game)));
    }

    fetchAllRegions(game) {
        return this._regions || (this._regions = collect((new GameData).regions(game)));
    }

    get scenarioValidator() {
        return this._scenarioValidator || (this._scenarioValidator = new ScenarioValidator);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository());
    }
}
