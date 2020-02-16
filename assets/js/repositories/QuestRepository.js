import quests from '../quests.json';
import Quest from "../models/Quest";
import QuestValidator from "../services/QuestValidator";

export default class QuestRepository {

    fetch() {
        return collect(quests.quests).map((quest) => {
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
