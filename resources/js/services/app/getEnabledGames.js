import componentMethods from "./componentMethods";
import GamesEnabled from "../../components/presenters/settings/GamesEnabled";

export default function getEnabledGames() {
    const gamesEnabledComponent = componentMethods(GamesEnabled);
    return gamesEnabledComponent.getEnabled();
}
