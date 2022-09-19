import GameData from "../services/GameData";
import Ability from "../models/Ability";

export default class AbilityRepository {

    abilities(character) {
        console.log(character.id);

        const x = collect(this.gameData.abilities(character.game))
            .where("character_id", character.id)
            .map((ability) => {
                ability = new Ability(ability);
                return ability;
            });

        console.log(x);

        return x;
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }

}
