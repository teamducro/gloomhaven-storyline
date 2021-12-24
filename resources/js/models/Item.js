import slugify from "slugify";

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
        this.lang = `items.${this.game}_${this.id}`;
    }

    get name() {
        return app.$t(`${this.lang}.name`);
    }

    get desc() {
        let desc = app.$t(`${this.lang}.desc`);
        if (this.minusOneCardsAdded > 0) {
            desc += app.$t('\nAdd {x} {-1} to your attack modifier deck.').replaceAll('{x}', this.minusOneCardsAdded);
        }
        return desc;
    }

    get source() {
        return this._source ? app.$t(`${this.lang}.source`) : '';
    }

    get faq() {
        return this._faq ? app.$t(`${this.lang}.faq`) : '';
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

export default Item;
