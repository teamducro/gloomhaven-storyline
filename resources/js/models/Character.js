import Storable from './Storable'
import GameData from "../services/GameData";

class Character {

    static make(id, game) {
        return new Character({id, game});
    }

    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.characterName = data.characterName;
        this.level = data.level || 1;
        this.exp = data.exp || 0;
        this.gold = data.gold || 0;
        this.items = {...data.items};
        this.notes = data.notes || '';
        this.checks = {...data.checks};
        this.perks = {...data.perks};
        this.game = data.game;
        this.gameData = new GameData;

        this.fieldsToStore = {
            reputation: 'name',
            id: 'id',
            level: 'level',
            exp: 'exp',
            gold: 'gold',
            items: {'items': {}},
            notes: 'notes',
            checks: {'checks': {}},
            perks: {'perks': {}}
        };

        this.read();

        if (this.id && this.game && !this.characterName) {
            this.new();
        }
    }

    new() {
        this.characterName = this.gameData.characterNames(this.game)[this.id];
        this.name = this.characterName;
        this.fillBlanks();
    }

    fillBlanks() {
        for (let i = 0; i <= 17; i++) {
            this.checks[i] = this.checks[i] || false;
        }

        const perks = this.gameData.characterPerks(this.game);
        if (perks && typeof perks[this.id] === "Array") {
            perks[this.id].forEach((perk, index) => {
                for (let i = 0; i <= perk.count; i++) {
                    this.perks[index] = this.perks[index] || [];
                    this.perks[index][i] = this.perks[index][i] || false;
                }
            })
        }
    }

    read() {
        this.parentRead();
        this.fillBlanks();
    }

    valuesToStore() {
        let values = this.parentValuesToStore();
        values.checks = collect({...this.checks}).filter(v => v).all();
        return values;
    }

    key() {
        return 'character-' + this.id;
    }
}

Object.assign(Character.prototype, {
    parentRead: Storable.read,
    parentValuesToStore: Storable.valuesToStore,
    store: Storable.store,
});

export default Character;
