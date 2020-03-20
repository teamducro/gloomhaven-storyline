import ScenarioRepository from "../repositories/ScenarioRepository";
import {ScenarioState} from "../models/ScenarioState";
import QuestValidator from "./QuestValidator";

export default class ScenarioValidator {

    validate() {
        [1, 2].forEach(() => {
            app.scenarios.each((scenario) => {
                this.checkHidden(scenario);
                this.checkChoice(scenario);
                this.checkRequired(scenario);
                this.checkBlocked(scenario);
            });
        });

        this.questValidator.validate();
    }

    checkHidden(scenario) {
        let states = this.linkedStates(scenario);
        let unlocked = this.scenarioRepository.isScenarioUnlockedByTreasure(scenario);

        if (scenario.isHidden()) {
            if (states.has(ScenarioState.complete) || unlocked || scenario.id === 1) {
                scenario.state = ScenarioState.incomplete;
            }
        } else {
            if (states.has(ScenarioState.complete) === false && scenario.id !== 1 && !unlocked) {
                scenario.state = ScenarioState.hidden;
            }
        }
    }

    checkChoice(scenario) {
        let linkedScenarios = this.linkedScenarios(scenario);
        let unlocked = this.scenarioRepository.isScenarioUnlockedByTreasure(scenario);

        if (linkedScenarios.where('hasChoices', true).count()) {
            let chosen = linkedScenarios.firstWhere('choice2', scenario.id);
            let withoutChoicesStates = linkedScenarios.where('hasChoices', false).pluck('state', 'state');

            if (scenario.isHidden()) {
                if (chosen || withoutChoicesStates.has(ScenarioState.complete) || unlocked) {
                    scenario.state = ScenarioState.incomplete;
                }
            } else {
                if (!chosen && withoutChoicesStates.has(ScenarioState.complete) === false && !unlocked) {
                    scenario.state = ScenarioState.hidden;
                }
            }
        }

        if (scenario.hasChoices && scenario.choice && scenario.isComplete() === false) {
            scenario.choice = null;
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

    linkedScenarios(scenario) {
        return this.scenarioRepository.findMany(scenario.linked_from);
    }

    linkedStates(scenario) {
        return this.linkedScenarios(scenario).pluck('state', 'state');
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

    get questValidator() {
        return this.questValidator2 || (this.questValidator2 = new QuestValidator);
    }
}
