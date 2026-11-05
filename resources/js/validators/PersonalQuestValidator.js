import ScenarioRepository from "../repositories/ScenarioRepository";
import BuildingRepository from "../repositories/BuildingRepository";
import {ScenarioState} from "../models/ScenarioState";
import ScenarioValidator from "./ScenarioValidator";

export default class PersonalQuestValidator {
    validate(quest, sheet) {
        const goals = quest.progress.map((progress) => this.isPartialGoalMet(progress));
        const allGoalsMet = goals.every((goal) => goal);

        // Several goals can unlock the same scenario, any met goal keeps it unlocked
        const scenarioUnlocks = new Map();
        quest.progress.forEach((progress, index) => {
            if (progress.scenario_unlock) {
                scenarioUnlocks.set(progress.scenario_unlock, scenarioUnlocks.get(progress.scenario_unlock) || goals[index]);
            }
        });
        scenarioUnlocks.forEach((met, id) => this.toggleScenario(id, met, sheet));

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

    toggleScenario(id, unlock, sheet) {
        const scenario = this.scenarioRepository.find(id);
        if (unlock) {
            if (scenario.isHidden()) {
                this.scenarioRepository.changeState(scenario, ScenarioState.incomplete);
            }
            return;
        }

        // Un-checking the goal locks the scenario again, unless it is completed or unlocked some other way
        if (!scenario.isHidden() && !scenario.isComplete()) {
            const scenarioValidator = new ScenarioValidator;
            scenarioValidator.sheet = sheet;
            if (!scenarioValidator.isUnlockedByStory(scenario)) {
                this.scenarioRepository.setHidden(scenario);
            }
        }
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }
    get buildingRepository() {
        return this._buildingRepository || (this._buildingRepository = new BuildingRepository);
    }
}
