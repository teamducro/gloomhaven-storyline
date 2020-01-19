import ScenarioRepository from "../repositories/ScenarioRepository";
import {ScenarioState} from "../models/ScenarioState";

export default class ScenarioValidator {

    validate() {
        [1, 2].forEach(() => {
            app.scenarios.each((scenario) => {
                this.checkHidden(scenario);
                this.checkBlocked(scenario);
                this.checkRequired(scenario);
            });
        });
    }

    checkHidden(scenario) {
        let states = this.linkedStates(scenario);

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

        let states = this.blockedStates(scenario);

        if (scenario.isBlocked()) {
            if (states.has(ScenarioState.complete) === false) {
                scenario.state = ScenarioState.incomplete;
            }
        } else {
            if (states.has(ScenarioState.complete) && !scenario.isComplete() && this.linkedStates(scenario).has(ScenarioState.complete)) {
                scenario.state = ScenarioState.blocked;
            }
        }
    }

    checkRequired(scenario) {
        if (scenario.required_by.isEmpty()) {
            return;
        }

        let states = this.requiredStates(scenario);

        if (scenario.isRequired()) {
            if (states.has(ScenarioState.complete)) {
                scenario.state = ScenarioState.incomplete;
            }
        } else {
            if (states.has(ScenarioState.complete) === false && this.linkedStates(scenario).has(ScenarioState.complete)) {
                scenario.state = ScenarioState.required;
            }
        }
    }

    linkedStates(scenario) {
        return this.scenarioRepository.findMany(scenario.linked_from).pluck('state', 'state');
    }

    blockedStates(scenario) {
        return this.scenarioRepository.findMany(scenario.blocked_by).pluck('state', 'state');
    }

    requiredStates(scenario) {
        return this.scenarioRepository.findMany(scenario.required_by).pluck('state', 'state');
    }

    get scenarioRepository() {
        return this.scenarioRepository2 || (this.scenarioRepository2 = new ScenarioRepository);
    }
}
