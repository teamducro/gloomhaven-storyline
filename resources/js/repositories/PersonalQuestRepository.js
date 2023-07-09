import GameData from "../services/GameData";
import PersonalQuest from "../models/PersonalQuest";
import BuildingRepository from "./BuildingRepository";

export default class PersonalQuestRepository {

    fetch(game) {
        return collect(this.gameData.personalQuests(game)).map((quest) => {
            return new PersonalQuest(quest, game);
        });
    }

    find(id, game) {
        return this.fetch(game).firstWhere('id', id);
    }
    
    unlockedQuests(game) {
        return this.fetch(game).filter(quest => {
            if (!quest.requiredBuildingLevel) {
                return true;
            }
            let requiredBuilding = this.buildingRepository.find(quest.requiredBuildingLevel[0]);
            return requiredBuilding.isUnlocked() && requiredBuilding.level >= quest.requiredBuildingLevel[1];
        });
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
