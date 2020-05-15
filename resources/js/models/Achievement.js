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
            "awarded": {"_awarded": this._awarded},
            "count": {"_count": this._count}
        }

        this.read();
    }

    isGlobal() {
        return this.type === 'global';
    }

    isParty() {
        return this.type === 'party';
    }

    gain() {
        if (!this.awarded) {
            this._awarded = true;
        }

        if (this.count < this.upgrades.length + 1) {
            this._count++;
            this.store();
        }
    }

    lose() {
        if (this.count === 1) {
            this._awarded = false;
        }

        if (this.count > 0) {
            this._count--;
            this.store();
        }
    }

    get awarded() {
        return this._awarded;
    }

    get count() {
        return this._count;
    }

    get displayName() {
        return this.count > 1 ? this.name + " (" + this.count + ")" : this.name;
    }

    get image() {
        const file = this.count > 1 ? this.id + this.count : this.id;
        return '/img/achievements/' + file + '.png';
    }

    key() {
        return 'achievement-' + this.id;
    }
}

Object.assign(Achievement.prototype, Storable);

export default Achievement;
