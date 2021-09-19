import slugify from "slugify";

class Item {

    constructor(data, game) {
        this.id = data.id;
        this.number = '#' + String(data.id).padStart(3, '0');
        this._name = data.name;
        this.cost = data.cost;
        this.count = data.count;
        this._slot = data.slot;
        this.source = data.source;
        this._desc = data.desc;
        this.minusOneCardsAdded = data.minusOneCardsAdded || 0;
        this.faq = data.faq;
        this.spent = data.spent || false;
        this.consumed = data.consumed || false;
        this.game = game;
    }

    get name() {
        return app.$t('items.' + this._name.replace("'", ''));
    }

    get desc() {
        let desc = this._desc;
        if (this.minusOneCardsAdded > 0) {
            desc += ' Add ' + this.minusOneCardsAdded + ' {-1} to your attack modifier deck.';
        }
        return desc;
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
