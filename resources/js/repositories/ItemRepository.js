import Item from "../models/Item";
import GameData from "../services/GameData";

export default class ItemRepository {

    fetch() {
        return collect((new GameData).items()).map((item) => {
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
