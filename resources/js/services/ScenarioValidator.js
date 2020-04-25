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
        if (scenario.state === ScenarioState.hidden || scenario.state === ScenarioState.complete) {
            return;
        }

        if (scenario.required_by.isEmpty()) {
            return;
        }


        let self = this;
        let conditions = scenario.required_by;

        let incompleteScenariosOk = conditions.every((condition) => {
            let incomplete = collect(condition.incomplete);
            return incomplete.every((incompleteRequirement) => {
                let achievement = self.achievementRepository.find(incompleteRequirement) || {};
                return !achievement.awarded;
            });
        });
        if (!incompleteScenariosOk) {
            scenario.state = ScenarioState.blocked;
            return;
        }

        let completeScenariosOk = conditions.contains((condition) => {
            let complete = collect(condition.complete);
            return complete.every((completeRequirement) => {
                let achievement = self.achievementRepository.find(completeRequirement) || {};
                // TODO check count
                return achievement.awarded;
            });
        });
        if (!completeScenariosOk) {
            scenario.state = ScenarioState.required;
            return;
        }

        if (completeScenariosOk && incompleteScenariosOk) {
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
        return this.scenarioRepository2 || (this.scenarioRepository2 = new ScenarioRepository);
    }

    get achievementRepository() {
        return this.achievementRepository2 || (this.achievementRepository2 = new AchievementRepository);
    }

    get questValidator() {
        return this.questValidator2 || (this.questValidator2 = new QuestValidator);
    }
}
