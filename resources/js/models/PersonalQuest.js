import Card from "./Card";
import UsesTranslations from "./UsesTranslations";

class PersonalQuest {

    constructor(data, game) {
        this.id = data.id;
        this.number = '#' + String(data.id).padStart(3, '0');
        this._name = data.name;
        this.character_unlock = data.character_unlock;
        this.unlock = data.unlock;
        this.progress = [...data.progress];
        this.card = new Card('Q-' + this.id, game);
        this.game = game;
        this.translationKey = 'personal_quests';
    }

    get name() {
        return this.$tPrefix(this._name.replace("'", ''));
    }

    applyProgress(progress = []) {
        for (const key in progress) {
            this.progress[key].value = _.clone(progress[key]);
        }
    }

    valuesToStore() {
        return {
            id: this.id,
            game: this.game,
            progress: _.clone(collect(this.progress).pluck('value').toArray())
        };
    }
}

Object.assign(PersonalQuest.prototype, UsesTranslations);

export default PersonalQuest;
