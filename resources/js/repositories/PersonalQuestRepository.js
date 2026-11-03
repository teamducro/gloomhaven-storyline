import GameData from "../services/GameData";
import PersonalQuest from "../models/PersonalQuest";
import BuildingRepository from "./BuildingRepository";
import SheetCalculations from "../services/SheetCalculations";
import {Game} from "../models/Game";

// Games whose personal quest deck the ConQuests promo pack can be shuffled into.
const conquestsGames = [Game.gh, Game.fc, Game.fh];

export default class PersonalQuestRepository {

    // Always includes promo pack quests, so a character holding one still loads after the pack is disabled.
    fetch(game) {
        let quests = this.gameData.personalQuests(game);
        if (conquestsGames.includes(game)) {
            quests = quests.concat(this.gameData.conquestsPersonalQuests());
        }

        return collect(quests).map((quest) => {
            return new PersonalQuest(quest, game);
        });
    }

    find(id, game) {
        return this.fetch(game).firstWhere('id', id);
    }
    
    unlockedQuests(game, sheet) {
        return this.fetch(game).filter(quest => {
            if (quest.pack === 'conquests') {
                return this.conquestsAvailable(quest, game, sheet);
            }
            if (!quest.requiredBuildingLevel) {
                return true;
            }
            let requiredBuilding = this.buildingRepository.find(quest.requiredBuildingLevel[0]);
            return requiredBuilding?.isUnlocked() && requiredBuilding.level >= quest.requiredBuildingLevel[1];
        });
    }

    conquestsAvailable(quest, game, sheet) {
        if (!sheet?.conquestsEnabled) {
            return false;
        }
        // calculateProsperity is a mixin method that calls this.prosperityBreaks, so bind it to the mixin.
        const prosperity = SheetCalculations.methods.calculateProsperity.call(SheetCalculations.methods, sheet.prosperityIndex, game);

        return prosperity >= quest.requiredProsperity;
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
