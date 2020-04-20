import store from "store/dist/store.modern";

export default class Achievement {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.group = data.group;
        this.requirement = data.requirement;
        this._awarded = false;
        this.read();
    }

    store() {
        store.set(this.key(), {
            "awarded": this._awarded
        });
    }

    read() {
        let achievement = store.get(this.key());
        if (achievement) {
            this._awarded = achievement.awarded;
        }
    }

    key() {
        return 'achievement-' + this.id;
    }

    set awarded(state) {
        this._awarded = state;
        this.store();
    }
    get awarded() {
        return this._awarded;
    }
}