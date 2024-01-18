import Quest from "../models/Quest";
import QuestValidator from "../services/QuestValidator";
import GameData from "../services/GameData";

export default class QuestRepository {

    fetch(game) {
        return collect(this.gameData.quests(game)).map((quest) => {
            return new Quest(quest);
        });
    }

    find(id) {
        return app.quests.firstWhere('id', id);
    }

    findMany(list) {
        return app.quests.whereIn(list).filter();
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
}
