import Storable from './Storable'
import Character from "./Character";
import GameData from "../services/GameData";
import Helpers from "../services/Helpers";
import CharacterRepository from "../repositories/CharacterRepository";

const md5 = require('js-md5');

class Sheet {

    static make(game) {
        return new Sheet({game: game});
    }

    constructor(data = {}) {
        this.reputation = data.reputation || 0;
        this.donations = data.donations || 0;
        this.prosperityIndex = data.prosperityIndex || 1;
        this.itemDesigns = {...data.itemDesigns};
        this.city = {...data.city};
        this.road = {...data.road};
        this.notes = data.notes || '';
        this.unlocks = {...data.unlocks};
        this.xResult = data.xResult || '';
        this.characterUnlocks = {...data.characterUnlocks};
        this.characters = {...data.characters};
        this.archivedCharacters = {...data.archivedCharacters};
        this.game = data.game;
        this.characterRepository = new CharacterRepository();

        this.fieldsToStore = {
            reputation: 'reputation',
            donations: 'donations',
            prosperityIndex: 'prosperityIndex',
            itemDesigns: {'itemDesigns': {}},
            city: {'city': {}},
            road: {'road': {}},
            notes: {'notes': ''},
            unlocks: {'unlocks': {}},
            xResult: {'xResult': ''},
            characterUnlocks: {'characterUnlocks': {}},
            characters: {'characters': {}},
            archivedCharacters: {'archivedCharacters': {}},
        };

        this.read();

        if (typeof app.campaignData[this.key()] === 'undefined') {
            this.new();
        }
    }

    new() {
        // Nothing to set up..
    }

    fillBlanksGH() {
        for (let i = 71; i <= 150; i++) {
            this.itemDesigns[i] = this.itemDesigns[i] || false;
        }

        if (!Object.keys(this.city).length) {
            for (let i = 1; i <= 30; i++) {
                this.city[i] = true;
            }
        }

        if (!Object.keys(this.road).length) {
            for (let i = 1; i <= 30; i++) {
                this.road[i] = true;
            }
        }

        for (let i = 1; i <= 90; i++) {
            this.city[i] = this.city[i] || false;
        }

        for (let i = 1; i <= 69; i++) {
            this.road[i] = this.road[i] || false;
        }

        // FC
        this.road[82] = this.road[82] || false;
        this.road[83] = this.road[83] || false;

        for (let i = 0; i < 9; i++) {
            this.unlocks[i] = this.unlocks[i] || false;
        }
    }

    fillBlanksJotl() {
        for (let i = 26; i <= 36; i++) {
            this.itemDesigns[i] = this.itemDesigns[i] || false;
        }

        if (!Object.keys(this.city).length) {
            for (let i = 1; i <= 22; i++) {
                this.city[i] = true;
            }
        }
    }

    fillRelations() {
        for (const uuid in this.characters) {
            if (!(this.characters[uuid] instanceof Character)) {
                this.characters[uuid] = Character.make(uuid, this.game);
            }
        }

        for (const uuid in this.archivedCharacters) {
            if (!(this.archivedCharacters[uuid] instanceof Character)) {
                this.archivedCharacters[uuid] = Character.make(uuid, this.game);
            }
        }
    }

    fillCharacterUnlocks() {
        // Ensures character order is reloaded, needed to reveal hidden characters
        this._characterOrder = undefined;

        const characterOrder = this.characterRepository.ids(this.game);
        for (const i in characterOrder) {
            const id = characterOrder[i];
            if (id) {
                this.characterUnlocks[id] = this.starterCharacters.includes(id)
                    ? true
                    : (this.characterUnlocks[id] || this.characterUnlocks[i] || false);
            }
        }

        // Remove old character unlocks from party sheet, keys are ids now
        // Remove hidden characters
        this.characterUnlocks = _.each(this.characterUnlocks, (characterUnlock, id) => {
            if (!characterOrder.includes(id)) {
                delete this.characterUnlocks[id];
            }
        });
    }

    getHash() {
        return md5(JSON.stringify(this));
    }

    read() {
        this.parentRead();
        this.migrateCharacterUnlocks();
        this.migrateEnvelopeXResult();

        switch (this.game) {
            case 'jotl':
                this.fillBlanksJotl();
                break;
            default:
                this.fillBlanksGH();
        }

        this.fillCharacterUnlocks();
        this.fillRelations();
    }

    // characterUnlocks used to be stored in key characters, migrate them to be backwards compatible.
    migrateCharacterUnlocks() {
        if (0 in this.characters && this.characters[0] === true) {
            this.characterUnlocks = JSON.parse(JSON.stringify(this.characters));
            this.characters = {};
        }
    }

    migrateEnvelopeXResult() {
        if (this.unlocks[9]) {
            this.xResult = 'Bladeswarm';
            delete this.unlocks[9];
        }
    }

    valuesToStore() {
        let values = this.parentValuesToStore();
        values.itemDesigns = collect({...this.itemDesigns}).filter(v => v).all();
        values.city = collect({...this.city}).filter(v => v).all();
        values.road = collect({...this.road}).filter(v => v).all();
        values.unlocks = collect({...this.unlocks}).filter(v => v).all();
        values.characterUnlocks = collect({...this.characterUnlocks}).filter(v => v).all();
        values.characters = collect({...this.characters}).mapWithKeys(character => [character.uuid, character.id]).all();
        values.archivedCharacters = collect({...this.archivedCharacters}).mapWithKeys(character => [character.uuid, character.id]).all();
        return values;
    }

    get starterCharacters() {
        switch (this.game) {
            case 'fc':
                return ["DR", "BR", "CH", "SW", "TI", "SC", "MT"];
            case 'jotl':
                return ["RG", "DM", "HT", "VW"];
            default:
                return ["BR", "CH", "SW", "TI", "SC", "MT"];
        }
    }

    get characterOrder() {
        if (this._characterOrder) {
            return this._characterOrder;
        }

        const characterOrder = this.characterRepository.ids(this.game);
        const characterOrderWithStartersFirst = Helpers.unique([...this.starterCharacters, ...characterOrder]);
        this._characterOrder = Helpers.reverse(Object.assign({}, characterOrderWithStartersFirst));

        return this._characterOrder;
    }

    key() {
        switch (this.game) {
            case 'gh':
            case 'fc':
                return 'sheet';
            default:
                return 'sheet-' + this.game;
        }
    }
}

Object.assign(Sheet.prototype, {
    parentRead: Storable.read,
    parentValuesToStore: Storable.valuesToStore,
    store: Storable.store,
});

export default Sheet;
