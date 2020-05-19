import AchievementRepository from "./AchievementRepository";
import scenarios from '../scenarios.json';
import Scenario from "../models/Scenario";
import ScenarioValidator from "../services/ScenarioValidator";
import {ScenarioState} from "../models/ScenarioState";

export default class ScenarioRepository {
    fetch() {
        return collect(scenarios.scenarios).map((scenario) => {
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
        } else if (previousState === ScenarioState.complete && (scenario.isIncomplete() || scenario.isHidden())) {
            this.undoAchievements(scenario)
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

    choice(scenario) {
        return this.findMany(scenario.choices).firstWhere('state', '!=', ScenarioState.hidden);
    }

    hideAllScenarios() {
        app.scenarios.each((scenario) => {
            scenario.state = ScenarioState.hidden;
        });

        this.scenarioValidator.validate();
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

    fetchChapter(scenario) {
        if (scenario.chapter_id) {
            scenario.chapter_name = this.chapters.firstWhere('id', scenario.chapter_id).name;
        }
    }

    fetchRegions(scenario) {
        if (scenario.region_ids.length) {
            scenario.regions = this.regions.whereIn('id', scenario.region_ids);
        }
    }

    setQuests(scenarios, quests) {
        scenarios.each(scenario => {
            scenario.quests = quests.whereIn('id', scenario.quests);
        });
    }

    get chapters() {
        return this.chapters2 || (this.chapters2 = collect(scenarios.chapters));
    }

    get regions() {
        return this.regions2 || (this.regions2 = collect(scenarios.regions));
    }

    get scenarioValidator() {
        return this.scenarioValidator2 || (this.scenarioValidator2 = new ScenarioValidator);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository());
    }
}
