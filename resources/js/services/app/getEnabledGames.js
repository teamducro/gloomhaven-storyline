import store from "store/dist/store.modern";
import GameData from "../GameData";
import bus from "../EventBus";

// The stored choice per game, falling back to the game's default.
export function enabledGamesMap() {
    const stored = store.get('gamesEnabled', {});
    const gameData = new GameData;

    return Object.fromEntries(gameData.games().map(code => [
        code,
        code in stored ? stored[code] : gameData.enabledByDefault(code),
    ]));
}

export function announceEnabledGames(enabled) {
    const games = Object.keys(enabled).filter(code => enabled[code]);
    bus.$emit('enabled-games-changed', games);

    return games;
}

export default function getEnabledGames() {
    return announceEnabledGames(enabledGamesMap());
}
