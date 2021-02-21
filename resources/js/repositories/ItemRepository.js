import items from '../items.json';
import Item from "../models/Item";

export default class ItemRepository {

    fetch() {
        return collect(items).map((item) => {
            item = new Item(item);
            return item;
        });
    }

    find(id) {
        return app.items ? app.items.firstWhere('id', id) : null;
    }

    findMany(list) {
        return collect().wrap(list).map((id) => {
            return this.find(id);
        }).filter();
    }

    where(filter) {
        return app.items.filter(filter);
    }

}
