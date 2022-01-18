import slugify from "slugify";
import UsesTranslations from "./UsesTranslations";
import Character from "./Character";

class Item {

    constructor(data, game) {
        this.id = data.id;
        this.number = '#' + String(data.id).padStart(3, '0');
        this._name = data.name;
        this.cost = data.cost;
        this.count = data.count;
        this._slot = data.slot;
        this._source = data.source;
        this._desc = data.desc;
        this.minusOneCardsAdded = data.minusOneCardsAdded || 0;
        this._faq = data.faq;
        this.spent = data.spent || false;
        this.consumed = data.consumed || false;
        this.game = game;
        this.translationKey = `items.${this.game}_${this.id}`;
    }

    get name() {
        return this.$tPrefix('name');
    }

    get desc() {
        return this.$tPrefix('desc');
    }

    get source() {
        return this._source ? this.$tPrefix('source') : '';
    }

    get faq() {
        return this._faq ? this.$tPrefix('faq') : '';
    }

    get use() {
        if (this.spent) {
            return '/img/icons/general/spent_white.png';
        } else if (this.consumed) {
            return '/img/icons/general/consumed_white.png';
        }
        return '';
    }

    get slot() {
        return '/img/icons/equipment/' + slugify(this._slot, {lower: true}) + '.png';
    }

    get image() {
        // FC uses GH items
        const folder = this.game === 'fc' ? 'gh' : this.game;
        return '/img/items/' + folder + '/' + slugify(this._name.replaceAll("'", ''), {lower: true}) + '.png';
    }
}

Object.assign(Item.prototype, UsesTranslations);

export default Item;
