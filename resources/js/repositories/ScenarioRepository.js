import AchievementRepository from "./AchievementRepository";
import Scenario from "../models/Scenario";
import ScenarioValidator from "../services/ScenarioValidator";
import {ScenarioState} from "../models/ScenarioState";
import ItemTextParser from "../services/ItemTextParser";
import GameData from "../services/GameData";
import ScenarioCompletedService from "../services/ScenarioCompletedService";
import SheetRepository from "./SheetRepository";

export default class ScenarioRepository {
    fetch(game) {
        return collect((new GameData).scenarios(game)).map((scenario) => {
            scenario = new Scenario(scenario);
            this.fetchChapter(scenario);
            this.fetchRegions(scenario);

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
            this.scenarioCompletedService.complete(scenario);
        } else if (previousState === ScenarioState.complete && (scenario.isIncomplete() || scenario.isHidden())) {
            this.undoAchievements(scenario);
            this.processRewardedItems(scenario, false);
            this.scenarioCompletedService.rollback(scenario);
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

    choose(scenario, choice, validate = false) {
        if (choice) {
            scenario.state = ScenarioState.complete;
            scenario.choice = typeof choice === 'object' ? choice.id : choice;
        } else {
            scenario.choice = null;
        }

        if (validate) {
            this.scenarioValidator.validate();
        }
    }

    unlockTreasure(scenario, id, checked = true) {
        scenario.unlockTreasure(id, checked);

        this.processTreasureItems(scenario, id, checked);

        let reloadScenarios = scenario.treasures_to.has(id)
            || scenario.achievements_from_treasures.has(id)
            || this.scenarioCompletedService.hasHandler(scenario);

        this.processAchievementsFromTreasures(scenario, id, checked);
        this.scenarioCompletedService.complete(scenario, checked);

        if (reloadScenarios) {
            this.scenarioValidator.validate();
        }

        return reloadScenarios;
    }

    prevScenarios(scenario) {
        return this.findMany(scenario.linked_from)
            .where('state', ScenarioState.complete)
            .merge(this.unlockedFromTreasureScenarios(scenario).items)
            .filter();
    }

    nextScenarios(scenario) {
        if (scenario.isComplete()) {
            return this.findMany(scenario.links_to)
                .where('state', '!=', ScenarioState.hidden)
                .merge(this.unlockedByTreasureScenarios(scenario).items)
                .filter();
        }

        return collect();
    }

    unlockedFromTreasureScenarios(scenario) {
        if (scenario.treasures_from.count()) {
            return this.findMany(scenario.treasures_from)
                .filter((treasureScenario) => {
                    let treasure = treasureScenario.treasures_to.filter((treasure) => {
                        return treasure.includes(scenario.id);
                    }).keys().first();

                    return treasure && treasureScenario.isTreasureUnlocked(treasure);
                });
        }

        return collect();
    }

    unlockedByTreasureScenarios(scenario) {
        if (scenario.treasures_to.count()) {
            let unlocked = scenario.treasures_to.only(scenario.unlockedTreasures).flatten();
            return this.findMany(unlocked.items);
        }

        return collect();
    }

    isScenarioUnlockedByTreasure(scenario) {
        return this.unlockedFromTreasureScenarios(scenario).count() > 0;
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
        if (!items.isEmpty()) {
            let sheet = this.sheetRepository.make(app.game);
            items.each(item => {
                sheet.itemDesigns[item] = checked;
            });
            sheet.store();
        }
    }

    processAchievementsFromTreasures(scenario, id, checked) {
        if (scenario.achievements_from_treasures.has(id)) {
            scenario.achievements_from_treasures.get(id).forEach((achievement) => {
                if (checked) {
                    this.achievementRepository.gain(achievement);
                } else {
                    this.achievementRepository.remove(achievement);
                }
            })

            return true;
        }

        return false;
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
        return this.get()
            ? this.get().filter(filter)
            : collect();
    }

    get() {
        return app.scenarios
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
            return (scenario.achievements_awarded && scenario.achievements_awarded.contains(achievement.id))
                || scenario.achievements_from_treasures.only(scenario.unlockedTreasures).flatten().items.includes(achievement.id);
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

    fetchChapter(scenario) {
        if (scenario.chapter_id) {
            const chapter = this.fetchAllChapters(scenario.game).firstWhere('id', scenario.chapter_id);
            if (chapter) {
                scenario.chapter_name = chapter.name;
            }
        }
    }

    fetchRegions(scenario) {
        if (scenario.region_ids.length) {
            scenario.regions = this.fetchAllRegions(scenario.game).whereIn('id', scenario.region_ids);
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

    fetchRegionsWithScenarios(game) {
        const regionIds = this.where((scenario) => {
            return scenario.isVisible();
        }).pluck('region_ids').flatten().items;

        return this.fetchAllRegions(game).whereIn('id', regionIds);
    }

    get scenarioValidator() {
        return this._scenarioValidator || (this._scenarioValidator = new ScenarioValidator);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository());
    }

    get sheetRepository() {
        return this._sheetRepository || (this._sheetRepository = new SheetRepository());
    }

    get scenarioCompletedService() {
        return this._scenarioCompletedService || (this._scenarioCompletedService = new ScenarioCompletedService());
    }
}
