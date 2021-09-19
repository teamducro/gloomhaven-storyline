import Item from "../models/Item";
import GameData from "../services/GameData";

export default class ItemRepository {

    fetch(game) {
        return collect((new GameData).items(game)).map((item) => {
            item = new Item(item, game);
            return item;
        });
    }

    find(id) {
        return app.items ? app.items.firstWhere('id', parseInt(id)) : null;
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
