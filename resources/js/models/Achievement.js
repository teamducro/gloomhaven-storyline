import Storable from './Storable'
import Card from "./Card";
import UsesTranslations from "./UsesTranslations";

class Achievement {

    constructor(data) {
        this.id = data.id;
        this._name = data.name;
        this.type = data.type;
        this.x = data.x;
        this.group = data.group;
        this.requirement = data.requirement;
        this.upgrades = data.upgrades || [];
        this.hidden = data.hidden || false;
        this._awarded = false;
        this._manual_awarded = false;
        this._lost = false;
        this._count = 0;
        this.is_manual = data.is_manual || false;
        this.cards = collect(data.cards).map((card) => new Card(card, data.game));
        this.game = data.game;
        this.translationKey = `achievements.${this.game}-${this.id}`;

        this.fieldsToStore = {
            "awarded": {"_awarded": this._awarded},
            "count": {"_count": this._count},
            "lost": {"_lost": this._lost}
        };
        if (this.is_manual) {
            this.fieldsToStore.manual_awarded = {"_manual_awarded": this._manual_awarded};
        }

        this.read();
    }

    get name() {
        return this.$tPrefix('name');
    }

    isGlobal() {
        return this.type === 'Global';
    }

    isParty() {
        return this.type === 'Party';
    }

    isCampaign() {
        return this.type === 'Campaign';
    }

    gain() {
        if (!this.awarded) {
            this._awarded = true;
            if (this.upgrades.length === 0) {
                this._manual_awarded = true;
            }
        }

        if (this.count < this.upgrades.length + 1) {
            this._count++;
        }

        if (this.lost) {
            this._lost = false;
        }

        this.store();
    }

    remove() {
        if (this.count === 1) {
            this._awarded = false;
        }

        if (this.count > 0) {
            this._count--;
        }

        if (this.upgrades.length === 0) {
            this._manual_awarded = false;
        }

        this.store();
    }

    lose() {
        this._lost = true;
        this.remove();
    }

    get awarded() {
        return this._awarded;
    }

    get lost() {
        return this._lost;
    }

    get count() {
        return this._count;
    }

    get manual_awarded() {
        return this._manual_awarded;
    }

    get image() {
        const file = this.count > 1 ? this.id + this.count : this.id;
        return '/img/achievements/' + file + '.png';
    }

    hasCard() {
        return this.cards.count() > 0;
    }

    key() {
        return 'achievement-' + this.id;
    }
}

Object.assign(Achievement.prototype, Storable);
Object.assign(Achievement.prototype, UsesTranslations);

export default Achievement;
