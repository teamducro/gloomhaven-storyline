import store from "store/dist/store.modern";

export default class Achievement {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.x = data.x;
        this.group = data.group;
        this.requirement = data.requirement;
        this.upgrades = data.upgrades || [];
        this.hidden = data.hidden || false;
        this._awarded = false;
        this._count = 0;
        this.read();
    }

    isGlobal() {
        return this.type === 'global';
    }

    isParty() {
        return this.type === 'party';
    }

    store() {
        store.set(this.key(), {
            "awarded": this._awarded,
            "count": this._count
        });
    }

    read() {
        let achievement = store.get(this.key());
        if (achievement) {
            this._awarded = achievement.awarded;
            this._count = achievement.count;
        }
    }

    key() {
        return 'achievement-' + this.id;
    }

    set awarded(awarded) {
        this._awarded = awarded;
        this.store();
    }

    get awarded() {
        return this._awarded;
    }

    set count(count) {
        this._count = count;
        this.store();
    }

    get count() {
        return this._count;
    }

    get displayName() {
        return this.count > 1 ? this.name + " (" + this.count + ")" : this.name;
    }

    get image() {
        return '/img/achievements/' + this.id + '.png';
    }
}
