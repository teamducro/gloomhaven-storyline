import store from "store/dist/store.modern";
import {announceEnabledGames, enabledGamesMap} from "./getEnabledGames";

export default function enableGame(game) {
    const enabled = {...enabledGamesMap(), [game]: true};
    store.set('gamesEnabled', enabled);

    return announceEnabledGames(enabled);
}
