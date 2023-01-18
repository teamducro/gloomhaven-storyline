import GameData from "../services/GameData";
import Achievement from "../models/Achievement";

export default class AttackModifierRepository {
    get(character) {
        const baseCards = this.gameData.attackModifierDeck().base;
        const characterCards = this.gameData.attackModifierDeck()[character.id] || [];

        return collect(baseCards.concat(characterCards)).keyBy('code');
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
}
