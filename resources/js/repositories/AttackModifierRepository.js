import GameData from "../services/GameData";
import Achievement from "../models/Achievement";
import ModifierCard from "../models/ModifierCard";

export default class AttackModifierRepository {
    get(character, playerNumber = 1) {
        const baseCards = this.gameData.attackModifierDeck().base
            .map(card => {
                card = new ModifierCard(card);
                card.path = 'img/attack-modifiers/p'+playerNumber;
                return card
            })

        const characterCards = (this.gameData.attackModifierDeck()[character.id] || [])
            .map(card => {
                card = new ModifierCard(card);
                card.path = 'img/attack-modifiers/'+character.id;
                return card
            });

        return collect(baseCards.concat(characterCards)).keyBy('code');
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
}
