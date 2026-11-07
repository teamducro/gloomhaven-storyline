import GameData from "../services/GameData";
import PersonalQuest from "../models/PersonalQuest";
import BuildingRepository from "./BuildingRepository";
import SheetCalculations from "../services/SheetCalculations";
import {Game} from "../models/Game";

export default class PersonalQuestRepository {

    fetch(game) {
        return collect(this.gameData.personalQuests(game)).map((quest) => {
            return new PersonalQuest(quest, game);
        });
    }

    find(id, game) {
        return this.fetch(game).firstWhere('id', id);
    }
    
    unlockedQuests(game, sheet) {
        // Not concat(): collect.js flattens objects into their values
        return collect([...this.fetch(game).all(), ...this.conquests(game, sheet).all()]).filter(quest => {
            if (!quest.requiredBuildingLevel) {
                return true;
            }
            let requiredBuilding = this.buildingRepository.find(quest.requiredBuildingLevel[0]);
            return requiredBuilding?.isUnlocked() && requiredBuilding.level >= quest.requiredBuildingLevel[1];
        });
    }

    // ConQuests cards keep game "cq", so a held card still loads after the pack is turned off.
    conquests(game, sheet) {
        if (!this.gameData.conquestsGames().includes(game) || !this.gameData.enabledCrossovers().includes(Game.cq)) {
            return collect();
        }
        const prosperity = SheetCalculations.methods.calculateProsperity(sheet.effectiveProsperityIndex, game);

        return this.fetch(Game.cq).filter(quest => prosperity >= quest.requiredProsperity);
    }

    make(questData) {
        const quest = this.find(questData.id, questData.game);
        quest.applyProgress(questData.progress);
        quest.unlockedBuilding = questData.unlockedBuilding;

        return quest;
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
    get buildingRepository() {
        return this._buildingRepository || (this._buildingRepository = new BuildingRepository());
    }
}
