import slugify from "slugify";
import UsesTranslations from "./UsesTranslations";

class Item {

    constructor(data, game) {
        this.id = game + '-' + data.id;
        this._id = data.id;
        this.number = '#' + Item.formatId(data.id);
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
        // Crossover packs keep their own assets/translations wherever they're merged in.
        this._game = data.game || game;
        this.translationKey = `items.${this._game}-${data.id}`;
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

    get flip() {
        return !!this._backDesc;
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

    static formatId(id) {
        return /^\d+$/.test(id) ? String(id).padStart(3, '0') : id;
    }
}

Object.assign(Item.prototype, UsesTranslations);

export default Item;
