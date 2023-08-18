import slugify from "slugify";
import UsesTranslations from "./UsesTranslations";

class Item {

    constructor(data, game) {
        this.id = game + '-' + data.id;
        this.number = '#' + String(data.id).padStart(3, '0');
        this._name = data.name;
        this.cost = data.cost || data.resources;
        this.count = data.count;
        this._slot = data.slot;
        this._source = data.source;
        this._desc = data.desc;
        this._backDesc = data.backDesc;
        this.minusOneCardsAdded = data.minusOneCardsAdded || 0;
        this._faq = data.faq;
        this.spent = data.spent || false;
        this.consumed = data.consumed || false;
        this._game = game;
        this.translationKey = `items.${this.id}`;
    }

    get name() {
        return this.$tPrefix('name');
    }

    get desc() {
        return this.$tPrefix('desc');
    }

    get backDesc() {
        return this._backDesc && this.$tPrefix('backDesc');
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
        if (!this._slot) { return ''; }
        return '/img/icons/equipment/' + slugify(this._slot, {lower: true}) + '.png';
    }

    get code() {
        return slugify(this._name.replaceAll("'", ''), {lower: true});
    }

    get image() {
        return '/img/items/' + this.game + '/' + this.code + '.jpg';
    }

    get backImage() {
        return this._backDesc && '/img/items/' + this.game + '/' + this.code + '-back.jpg';
    }

    get game() {
        // FC uses GH items
        return this._game === 'fc' ? 'gh' : this._game;
    }
}

Object.assign(Item.prototype, UsesTranslations);

export default Item;
