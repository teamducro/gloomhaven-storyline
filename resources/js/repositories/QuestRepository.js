import Quest from "../models/Quest";
import QuestValidator from "../services/QuestValidator";
import GameData from "../services/GameData";

export default class QuestRepository {

    fetch() {
        return collect((new GameData).quests()).map((quest) => {
            return new Quest(quest);
        });
    }

    find(id) {
        return app.quests.firstWhere('id', id);
    }

    findMany(list) {
        return app.quests.whereIn(list);
    }

    get questValidator() {
        return this.questValidator2 || (this.questValidator2 = new QuestValidator);
    }
}
