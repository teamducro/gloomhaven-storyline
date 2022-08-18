import Vue from "vue";
import GamesEnabled from "../../components/presenters/settings/GamesEnabled";

export default function getEnabledGames() {
    const gamesEnabledClass = Vue.extend(GamesEnabled);
    const gamesEnabledComponent = new gamesEnabledClass;
    return gamesEnabledComponent.getEnabled();
}
