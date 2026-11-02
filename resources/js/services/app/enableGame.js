import componentMethods from "./componentMethods";
import GamesEnabled from "../../components/presenters/settings/GamesEnabled";

export default function enableGame(game) {
    const gamesEnabledComponent = componentMethods(GamesEnabled);
    return gamesEnabledComponent.enableGame(game);
}
