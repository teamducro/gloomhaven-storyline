import scenarios from '../scenarios.json';
import Scenario from "../models/Scenario";
import ScenarioValidator from "../services/ScenarioValidator";
import {ScenarioState} from "../models/ScenarioState";

export default class ScenarioRepository {

    fetch() {
        return collect(scenarios.scenarios).map((scenario) => {
            scenario = new Scenario(scenario);
            this.fetchChapter(scenario);

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
        return app.scenarios.whereIn('id', list);
    }

    fetchChapter(scenario) {
        if (scenario.chapter_id) {
            scenario.chapter_name = this.chapters.firstWhere('id', scenario.chapter_id).name;
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

    get scenarioValidator() {
        return this.scenarioValidator2 || (this.scenarioValidator2 = new ScenarioValidator);
    }
}
