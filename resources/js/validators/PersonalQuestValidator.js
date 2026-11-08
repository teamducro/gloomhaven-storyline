import ScenarioRepository from "../repositories/ScenarioRepository";
import BuildingRepository from "../repositories/BuildingRepository";
import {ScenarioState} from "../models/ScenarioState";
import ScenarioValidator from "./ScenarioValidator";

export default class PersonalQuestValidator {
    validate(quest, sheet) {
        const goals = quest.progress.map((progress) => this.isPartialGoalMet(progress));
        const allGoalsMet = goals.every((goal) => goal);

        // Un-checking a goal doesn't lock its scenario again, players may have unlocked it without tracking progress
        quest.progress
            .filter((progress, index) => goals[index] && progress.scenario_unlock)
            .forEach(progress => this.unlockScenario(progress.scenario_unlock));

        // GH2e quest steps that add city events to the deck; un-checking leaves them, they're shuffled in.
        const cityEvents = quest.progress
            .filter((progress, index) => goals[index] && progress.city_events)
            .flatMap(progress => progress.city_events)
            .filter(id => !sheet.city[id]);
        if (cityEvents.length) {
            cityEvents.forEach(id => sheet.city[id] = true);
            sheet.store();
        }

        // When all goals are met, preform an action
        if (allGoalsMet) {
            // Unlock a character
            if (quest.character_unlock && sheet.characterUnlocks.hasOwnProperty(quest.character_unlock)) {
                if (!sheet.characterUnlocks[quest.character_unlock]) {
                    sheet.characterUnlocks[quest.character_unlock] = true;
                    sheet.addClassEvents(quest.character_unlock, 'unlock');
                    // The caller only stores the character, not the sheet.
                    sheet.store();
                }
            }
            // Unlock a building
            if (quest.building_unlocks && !quest.unlockedBuilding) {
                // If first preference is unlocked, fallback to the alt.
                let building = this.buildingRepository.find(quest.building_unlocks[0]);
                if (building.isUnlocked()) {
                    building = this.buildingRepository.find(quest.building_unlocks[1]);
                }
                if (building.isLocked()) {
                    this.buildingRepository.setAvailable(building);
                    building.level = 0;
                    quest.unlockedBuilding = building.id;
                }
            }
        }

        return allGoalsMet;
    }

    isPartialGoalMet(progress) {
        if (progress.type === 'checkbox') {
            return progress.value.every((x) => !!x);
        }
        if (progress.type === 'number') {
            return progress.value >= progress.target;
        }
        return false;
    }

    // Abandoning locks the quest's open scenarios again, completed ones stay (FAQ 3.2).
    lockScenarios(quest, sheet) {
        const scenarioValidator = new ScenarioValidator;
        scenarioValidator.sheet = sheet;
        quest.progress
            .filter(progress => progress.scenario_unlock)
            .map(progress => this.scenarioRepository.find(progress.scenario_unlock))
            // A quest of another game or edition may name a scenario that isn't in this campaign.
            .filter(scenario => scenario && !scenario.isHidden() && !scenario.isComplete() && !scenarioValidator.isUnlockedByStory(scenario))
            .forEach(scenario => this.scenarioRepository.setHidden(scenario));
    }

    unlockScenario(id) {
        const scenario = this.scenarioRepository.find(id);
        if (scenario?.isHidden()) {
            this.scenarioRepository.changeState(scenario, ScenarioState.incomplete);
        }
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }
    get buildingRepository() {
        return this._buildingRepository || (this._buildingRepository = new BuildingRepository);
    }
}
