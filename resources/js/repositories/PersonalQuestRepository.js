import GameData from "../services/GameData";
import PersonalQuest from "../models/PersonalQuest";

export default class PersonalQuestRepository {

    fetch(game) {
        return collect(this.gameData.personalQuests(game)).map((quest) => {
            return new PersonalQuest(quest, game);
        });
    }

    find(id, game) {
        return this.fetch(game).firstWhere('id', id);
    }

    make(questData) {
        const quest = this.find(questData.id, questData.game);
        quest.applyProgress(questData.progress);

        return quest;
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
}
