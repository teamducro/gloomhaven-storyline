import GameData from "../services/GameData";
import Achievement from "../models/Achievement";
import ModifierCard from "../models/ModifierCard";

export default class AttackModifierRepository {
    get(character, playerNumber = 1) {
        const baseCards = this.gameData.attackModifierDeck().base
            .map(code => {
                const path = 'p'+playerNumber;
                return new ModifierCard({code, path});
            })

        const characterCards = (this.gameData.attackModifierDeck()[character.id] || [])
            .map(code => {
                const path = character.id;
                return new ModifierCard({code, path});
            })

        return collect(baseCards.concat(characterCards)).keyBy('code');
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
}
