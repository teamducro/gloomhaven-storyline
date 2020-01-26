import scenarios from '../scenarios.json';
import Scenario from "../models/Scenario";
import ScenarioValidator from "../services/ScenarioValidator";
import {ScenarioState} from "../models/ScenarioState";

export default class ScenarioRepository {

    fetch() {
        return collect(scenarios.scenarios).map((scenario) => {
            scenario = new Scenario(scenario);
            this.fetchLinks(scenario);
            this.fetchBlocks(scenario);
            this.fetchRequirments(scenario);
            this.fetchChapter(scenario);

            return scenario;
        })
    }

    changeState(scenario, state) {
        scenario.state = state;

        this.scenarioValidator.validate();
    }

    choose(scenario, chosenScenario) {
        scenario.state = ScenarioState.complete;
        scenario.chosen = chosenScenario.id;

        this.scenarioValidator.validate();
    }

    chosenScenario(scenario) {
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
        })
    }

    fetchLinks(scenario) {
        scenario.links_to = this.links
            .where('source', scenario.id)
            .map((edge) => {
                return edge.target;
            });

        scenario.linked_from = this.links
            .where('target', scenario.id)
            .map((edge) => {
                return edge.source;
            });
    }

    fetchBlocks(scenario) {
        scenario.blocked_by = this.blocks
            .where('target', scenario.id)
            .map((edge) => {
                return edge.source;
            });
    }

    fetchRequirments(scenario) {
        scenario.required_by = this.requires
            .where('target', scenario.id)
            .map((edge) => {
                return edge.source;
            });
    }

    fetchChapter(scenario) {
        if (scenario.chapter_id) {
            scenario.chapter_name = this.chapters.firstWhere('id', scenario.chapter_id).name;
        }
    }

    get links() {
        return this.links2 || (this.links2 = collect(scenarios.links));
    }

    get blocks() {
        return this.blocks2 || (this.blocks2 = collect(scenarios.blocks));
    }

    get requires() {
        return this.requires2 || (this.requires2 = collect(scenarios.requires));
    }

    get chapters() {
        return this.chapters2 || (this.chapters2 = collect(scenarios.chapters));
    }

    get scenarioValidator() {
        return this.scenarioValidator2 || (this.scenarioValidator2 = new ScenarioValidator);
    }
}
