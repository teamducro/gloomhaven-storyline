import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";
import {ScenarioState} from "../models/ScenarioState";
import QuestValidator from "../services/QuestValidator";
import ChoiceService from "../services/ChoiceService";
import AchievementValidator from "./AchievementValidator";
import StorySyncer from "../services/StorySyncer";
import SheetRepository from "../repositories/SheetRepository";
import {Requirement} from "../models/Requirement";
import BuildingRepository from "../repositories/BuildingRepository";
import OverlayRepository from "../repositories/OverlayRepository";
import {BuildingState} from "../models/BuildingState";

export default class ScenarioValidator {

    validate(shouldSync = true) {
        this.needsValidating = true;
        this.sheet = (new SheetRepository).make(app.game);
        let count = 1;

        // Validate all scenarios
        while (this.needsValidating) {
            this.needsValidating = false;
            app.scenarios.each((scenario) => {
                let linkedScenarios = this.linkedScenarios(scenario);
                if (linkedScenarios.where('hasChoices', true).isEmpty()) {
                    this.checkHidden(scenario);
                } else {
                    this.checkChoice(scenario);
                }
                this.resetPrompts(scenario);
                this.checkRequired(scenario);
            });

            // Prevent infinite loop
            if (count > 4) {
                this.needsValidating = false;
            }
            count++;
        }

        // Validate all achievements
        this.achievementValidator.validate();

        // Validate all quest summaries
        this.questValidator.validate();

        // Sync story with server
        if (shouldSync) {
            this.storySyncer.store();
        }
    }

    checkHidden(scenario) {
        let states = this.linkedStates(scenario);
        let unlocked = this.scenarioRepository.isScenarioUnlockedByTreasure(scenario);

        if (scenario.isHidden()) {
            if (states.has(ScenarioState.complete) || unlocked || scenario.root || this.soloScenarioUnlocked(scenario)) {
                this.scenarioRepository.setIncomplete(scenario);
                this.needsValidating = true;
            }
        } else {
            if (states.has(ScenarioState.complete) === false && !scenario.is_side && !scenario.root && !unlocked && !this.soloScenarioUnlocked(scenario)) {
                this.scenarioRepository.setHidden(scenario);
                this.needsValidating = true;
            }
        }
    }

    checkChoice(scenario) {
        let linkedScenarios = this.linkedScenarios(scenario);
        let unlocked = this.scenarioRepository.isScenarioUnlockedByTreasure(scenario);

        // Skip when no linked scenarios are completed
        let states = this.linkedStates(scenario);
        if (states.has(ScenarioState.complete) === false && !unlocked) {
            if (scenario.isVisible()) {
                this.scenarioRepository.setHidden(scenario);
                this.needsValidating = true;
            }
            return;
        }

        if (linkedScenarios.where('hasChoices', true).count()) {
            let chosen = linkedScenarios.filter((s) => {
                return String(s.choice).split(',').includes(String(scenario.id));
            }).count() > 0;
            let withoutChoicesStates = linkedScenarios.where('hasChoices', false).pluck('state', 'state');

            if (scenario.isHidden()) {
                if (chosen || withoutChoicesStates.has(ScenarioState.complete) || unlocked) {
                    this.scenarioRepository.setIncomplete(scenario);
                    this.needsValidating = true;
                }
            } else {
                if (!chosen && withoutChoicesStates.has(ScenarioState.complete) === false && !unlocked) {
                    this.scenarioRepository.setHidden(scenario);
                    this.needsValidating = true;
                }
            }
        }
    }

    resetPrompts(scenario) {
        if (scenario.hasChoices && scenario.choice && scenario.isIncomplete()) {
            scenario.choice = null;
        }

        if (scenario.hasPrompt && scenario.isIncomplete()) {
            let promptConfig = this.choiceService.getPromptConfig(scenario);
            if (typeof promptConfig.callback === 'function') {
                promptConfig.callback(null);
            }
        }
    }

    checkRequired(scenario) {
        // Skip when no linked scenarios are completed, scenario is hidden or was completed before
        let states = this.linkedStates(scenario);
        if ((!scenario.is_side && states.has(ScenarioState.complete) === false) || scenario.isHidden() || scenario.isComplete()) {
            return;
        }

        let blockingConditions = scenario.blocks_on;
        let shouldBeBlocked = !!blockingConditions.count() && blockingConditions.contains((condition) => {
            let complete = condition.complete || [];
            let completeCheck = !!complete.length && this.checkCompleteConditions(complete);

            let incomplete = condition.incomplete || [];
            let incompleteCheck = !!incomplete.length && this.checkIncompleteConditions(incomplete);

            let lost = condition.lost || [];
            let lostCheck = lost.length && lost.every((achievementId) => {
                let achievement = this.achievementRepository.find(achievementId) || {};
                return achievement.lost;
            });

            return completeCheck || incompleteCheck || lostCheck;
        });

        if (shouldBeBlocked) {
            if (!scenario.isBlocked()) {
                this.scenarioRepository.setBlocked(scenario);
                this.needsValidating = true;
            }
            return;
        }

        let requiringConditions = scenario.required_by;
        let shouldBeRequired = !!requiringConditions.count() && requiringConditions.contains((condition) => {
            let allIncompleteRequirementsOk = this.checkIncompleteConditions(condition.incomplete || []);
            let allCompleteRequirementsOk = this.checkCompleteConditions(condition.complete || []);

            return allIncompleteRequirementsOk && allCompleteRequirementsOk;
        }) === false;

        if (shouldBeRequired && !scenario.isRequired()) {
            this.scenarioRepository.setRequired(scenario);
            this.needsValidating = true;
        }

        if (!shouldBeBlocked && !shouldBeRequired && !scenario.isIncomplete()) {
            this.scenarioRepository.setIncomplete(scenario);
            this.needsValidating = true;
        }
    }

    checkCompleteConditions(conditions, shouldBeCompleted = true) {
        return conditions.every((scenarioOrAchievementId) => {
            // Scenarios
            if (Number.isInteger(scenarioOrAchievementId)) {
                let scenario = this.scenarioRepository.find(scenarioOrAchievementId) || {};
                return shouldBeCompleted ? scenario.isComplete() : !scenario.isComplete();
            }
            // Building/Overlay Requirements
            else if (Requirement.requirements().includes(scenarioOrAchievementId)) {
                const overlayId = Requirement.overlayId(scenarioOrAchievementId);
                const overlay = this.overlayRepository.find(overlayId);
                return shouldBeCompleted ? overlay.present : !overlay.present;
            }
            // Achievements
            else {
                let achievement = this.achievementRepository.find(scenarioOrAchievementId) || {};
                return shouldBeCompleted ? achievement.awarded : !achievement.awarded;
            }
        });
    }

    checkIncompleteConditions(conditions) {
        return this.checkCompleteConditions(conditions, false);
    }

    linkedScenarios(scenario) {
        return this.scenarioRepository.findMany(scenario.linked_from);
    }

    linkedStates(scenario) {
        return this.linkedScenarios(scenario).pluck('state', 'state');
    }

    soloScenarioUnlocked(scenario) {
        if (!scenario.solo) {
            return false;
        }

        const partyCharacters = collect(this.sheet.characters).pluck('id').toArray()

        return this.sheet.characterUnlocks[scenario.solo] || partyCharacters.includes(scenario.solo)
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }

    get buildingRepository() {
        return this._buildingRepository || (this._buildingRepository = new BuildingRepository);
    }

    get overlayRepository() {
        return this._overlayRepository || (this._overlayRepository = new OverlayRepository);
    }

    get achievementValidator() {
        return this._achievementValidator || (this._achievementValidator = new AchievementValidator);
    }

    get questValidator() {
        return this._questValidator || (this._questValidator = new QuestValidator);
    }

    get choiceService() {
        return this._choiceService || (this._choiceService = new ChoiceService);
    }

    get storySyncer() {
        return this._storySyncer || (this._storySyncer = new StorySyncer);
    }
}
