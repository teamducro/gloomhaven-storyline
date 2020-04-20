import AchievementRepository from "./AchievementRepository";
import scenarios from '../scenarios.json';
import Scenario from "../models/Scenario";
import ScenarioValidator from "../services/ScenarioValidator";
import {ScenarioState} from "../models/ScenarioState";
import QuestValidator from "../services/QuestValidator";

export default class ScenarioRepository {
    fetch() {
        return collect(scenarios.scenarios).map((scenario) => {
            scenario = new Scenario(scenario);
            this.fetchChapter(scenario);
            this.fetchRegions(scenario);

            return scenario;
        });
    }

    changeState(scenario, state) {
        scenario.state = state;
        if (state === ScenarioState.complete) {
            this.processAchievements(scenario);
        }

        this.scenarioValidator.validate();
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
        return app.scenarios.firstWhere('id', id);
    }

    findMany(list) {
        return collect().wrap(list).map((id) => {
            return this.find(id);
        });
    }

    findWhere(filterCallback) {
        return app.scenarios.filter(filterCallback);
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
