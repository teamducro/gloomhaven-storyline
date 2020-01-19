import ScenarioRepository from "../repositories/ScenarioRepository";
import {ScenarioState} from "../models/ScenarioState";

export default class ScenarioValidator {

    constructor() {
        this.scenarioRepository = new ScenarioRepository();
    }

    changeState(scenario, state) {
        scenario.state = state;

        this.validate();
    }

    validate() {
        app.scenarios.each((scenario) => {
            this.checkHidden(scenario);
            this.checkBlocked(scenario);
            this.checkRequired(scenario);
        });
    }

    checkHidden(scenario) {
        let linked = this.scenarioRepository.findMany(scenario.linked_from);
        let states = linked.pluck('state', 'state');

        if (scenario.isHidden()) {
            if (states.has(ScenarioState.complete) || scenario.id === 1) {
                scenario.state = ScenarioState.incomplete;
            }
        } else {
            if (states.has(ScenarioState.complete) === false && scenario.id !== 1) {
                scenario.state = ScenarioState.hidden;
            }
        }
    }

    checkBlocked(scenario) {
        if (scenario.blocked_by.isEmpty()) {
            return;
        }

        let blocks = this.scenarioRepository.findMany(scenario.blocked_by);
        let states = blocks.pluck('state', 'state');

        if (scenario.isBlocked()) {
            if (states.has(ScenarioState.complete) === false) {
                scenario.state = ScenarioState.incomplete;
            }
        } else {
            if (states.has(ScenarioState.complete) && !scenario.isComplete()) {
                let linked = this.scenarioRepository.findMany(scenario.linked_from);
                let states = linked.pluck('state', 'state');
                if (states.has(ScenarioState.complete)) {
                    scenario.state = ScenarioState.blocked;
                }
            }
        }
    }

    checkRequired(scenario) {
        if (scenario.required_by.isEmpty()) {
            return;
        }

        let requires = this.scenarioRepository.findMany(scenario.required_by);
        let states = requires.pluck('state', 'state');

        if (scenario.isRequired()) {
            if (states.has(ScenarioState.complete)) {
                scenario.state = ScenarioState.incomplete;
            }
        } else {
            if (states.has(ScenarioState.complete) === false) {
                scenario.state = ScenarioState.required;
            }
        }
    }
}
