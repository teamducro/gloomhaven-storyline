import Vue from "vue";
import GamesEnabled from "../../components/presenters/settings/GamesEnabled";

export default function enableGame(game) {
    const gamesEnabledClass = Vue.extend(GamesEnabled);
    const gamesEnabledComponent = new gamesEnabledClass;
    return gamesEnabledComponent.enableGame(game);
}
