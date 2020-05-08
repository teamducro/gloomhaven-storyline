import Storable from './Storable'

class Achievement {

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

        this.fieldsToStore = {
            "awarded": "_awarded",
            "count": "_count"
        }

        this.read();
    }

    isGlobal() {
        return this.type === 'global';
    }

    isParty() {
        return this.type === 'party';
    }

    set awarded(awarded) {
        if (this._awarded === awarded) {
            return;
        }
        this._awarded = awarded;
        this.store();
    }

    get awarded() {
        return this._awarded;
    }

    set count(count) {
        if (this._count === count) {
            return;
        }
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

Object.assign(Achievement.prototype, Storable);

export default Achievement;
