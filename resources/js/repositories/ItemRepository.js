import Item from "../models/Item";
import GameData from "../services/GameData";

export default class ItemRepository {

    fetch(game) {
        return collect(this.gameData.items(game)).mapWithKeys((item) => {
            item = new Item(item, game);
            return [item.id, item];
        });
    }

    find(id) {
        id = this.prefixGame(id);
        return app.items ? app.items.get(id) : null;
    }

    findMany(list) {
        return collect().wrap(list).mapWithKeys((id) => {
            return [id, this.find(id)];
        }).filter();
    }

    where(filter) {
        return app.items.filter(filter);
    }

    fromGame(game) {
        return this.where((item) => {
            return item.game === game;
        })
    }

    // If id is numeric, prepend the current game
    prefixGame(id) {
        if (!isNaN(id)) {
            // FC uses GH items
            const game = app.game === 'fc' ? 'gh' : app.game;
            id = game + '-' + id;
        }

        return id;
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }

}
