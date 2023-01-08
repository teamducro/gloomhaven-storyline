import GameData from "../services/GameData";
import Ability from "../models/Ability";

export default class AbilityRepository {

    abilities(character) {
        return collect(this.gameData.abilities(character.game))
            .where("character_id", character.id)
            .map((ability) => {
                ability = new Ability(ability);
                return ability;
            });
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }

}
