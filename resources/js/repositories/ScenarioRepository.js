import scenarios from '../scenarios.json';
import Scenario from "../models/Scenario";
import ScenarioValidator from "../services/ScenarioValidator";
import {ScenarioState} from "../models/ScenarioState";

export default class ScenarioRepository {

    fetch() {
        return collect(scenarios.scenarios).map((scenario) => {
            scenario = new Scenario(scenario);
            this.fetchChapter(scenario);
            this.fetchTypes(scenario);

            return scenario;
        });
    }

    changeState(scenario, state) {
        scenario.state = state;

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

    fetchChapter(scenario) {
        if (scenario.chapter_id) {
            scenario.chapter_name = this.chapters.firstWhere('id', scenario.chapter_id).name;
        }
    }

    fetchTypes(scenario) {
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
}
