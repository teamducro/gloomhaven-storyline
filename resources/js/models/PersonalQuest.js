import Card from "./Card";
import UsesTranslations from "./UsesTranslations";

class PersonalQuest {

    constructor(data, game) {
        this.id = data.id;
        this.number = '#' + String(data.id).padStart(3, '0');
        this._name = data.name;
        this.character_unlock = data.character_unlock;
        this.building_unlocks = data.building_unlocks;
        this._unlock = data.unlock;
        this.progress = [...data.progress];
        this.card = new Card('Q-' + this.id, game);
        // Store already unlocked building so that subsequent validations don't unlock the alt. building
        this.unlockedBuilding = data.unlockedBuilding;
        this._game = game;
        this.translationKey = `personal_quests.${this.game}-${this.id}`;
    }

    get name() {
        return this.$tPrefix('name');
    }

    get unlock() {
        return this.$tPrefix('unlock');
    }

    get translatedProgress() {
        return this.$tPrefix('progress');
    }

    get game() {
        // FC uses GH PQ
        return this._game === 'fc' ? 'gh' : this._game;
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
            progress: _.clone(collect(this.progress).pluck('value').toArray()),
            unlockedBuilding: this.unlockedBuilding,
        };
    }
}

Object.assign(PersonalQuest.prototype, UsesTranslations);

export default PersonalQuest;
