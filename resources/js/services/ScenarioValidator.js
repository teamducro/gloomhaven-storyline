import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";
import {ScenarioState} from "../models/ScenarioState";
import QuestValidator from "./QuestValidator";

export default class ScenarioValidator {

    validate() {
        [1, 2, 3, 4].forEach(() => {
            app.scenarios.each((scenario) => {
                this.checkHidden(scenario);
                this.checkChoice(scenario);
                this.checkRequired(scenario);
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
            if (states.has(ScenarioState.complete) === false && !scenario.is_side && scenario.id !== 1 && !unlocked) {
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

    checkRequired(scenario) {
        if (scenario.isHidden() || scenario.isComplete() || scenario.required_by.isEmpty()) {
            return;
        }

        let conditions = scenario.required_by;

        let shouldBeBlocked = conditions.every((condition) => {
            let incomplete = collect(condition.incomplete);
            return incomplete.every((incompleteRequirement) => {
                let achievement = this.achievementRepository.find(incompleteRequirement) || {};
                return !achievement.awarded;
            });
        }) === false;

        if (shouldBeBlocked) {
            scenario.state = ScenarioState.blocked;
            return;
        }

        let shouldBeRequired = conditions.contains((condition) => {
            let complete = collect(condition.complete);
            return complete.every((completeRequirement) => {
                let achievement = this.achievementRepository.find(completeRequirement) || {};
                // TODO check count
                return achievement.awarded;
            });
        }) === false;

        if (shouldBeRequired) {
            scenario.state = ScenarioState.required;
            return;
        }

        if (!shouldBeBlocked && !shouldBeRequired) {
            scenario.state = ScenarioState.incomplete;
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
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }

    get questValidator() {
        return this._questValidator || (this._questValidator = new QuestValidator);
    }
}
