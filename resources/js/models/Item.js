import Storable from './Storable'
import Card from "./Card";

class Item {

    constructor(data) {
        this.id = data.id;
        this.number = '#' + String(data.id).padStart(3, '0');
        this._name = data.name;
        this.cost = data.cost;
        this.count = data.count;
        this.slot = data.slot;
        this.source = data.source;
        this.spent = data.spent;
        this.desc = data.desc;
        this.faq = data.faq;
    }

    get name() {
        return app.$t('items.' + this._name);
    }

    get image() {
        return '/img/items/' + this.id + '.png';
    }
}

export default Item;
