import Storable from './Storable'
import Character from "./Character";
import Helpers from "../services/Helpers";
import CharacterRepository from "../repositories/CharacterRepository";
import Versionable from "./Versionable";

class Sheet {

    static make(game) {
        return new Sheet({game: game});
    }

    constructor(data = {}) {
        this.version = data.version;
        this.hash = data.hash;
        this.reputation = data.reputation || 0;
        this.donations = data.donations || 0;
        this.prosperityIndex = data.prosperityIndex || 1;
        this.itemDesigns = {...data.itemDesigns};
        this.crossGameItemsEnabled = data.crossGameItemsEnabled || false;
        this.crossGameItems = {...data.crossGameItems};
        this.c = data.hidePersonalQuests || false;
        this.city = {...data.city};
        this.road = {...data.road};
        this.rift = {...data.rift}; // FC
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
            version: 'version',
            hash: 'hash',
            donations: 'donations',
            prosperityIndex: 'prosperityIndex',
            itemDesigns: {'itemDesigns': {}},
            city: {'city': {}},
            road: {'road': {}},
            rift: {'rift': {}},
            notes: {'notes': ''},
            unlocks: {'unlocks': {}},
            xResult: {'xResult': ''},
            characterUnlocks: {'characterUnlocks': {}},
            characters: {'characters': {}},
            archivedCharacters: {'archivedCharacters': {}},
            crossGameItemsEnabled: 'crossGameItemsEnabled',
            hidePersonalQuests: 'hidePersonalQuests',
            crossGameItems: {'crossGameItems': {}}
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
        for (let i = 71; i <= 151; i++) {
            this.itemDesigns[i] = this.itemDesigns[i] || false;
        }

        // FC
        for (let i = 152; i <= 164; i++) {
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

        for (let i = 1; i <= 20; i++) {
            this.rift[i] = this.rift[i] || false;
        }

        // FC
        this.road[82] = this.road[82] || false;
        this.road[83] = this.road[83] || false;

        for (let i = 0; i < 9; i++) {
            this.unlocks[i] = this.unlocks[i] || false;
        }

        this.itemDesigns = this.removeInvalid(this.itemDesigns, 164);
        this.city = this.removeInvalid(this.city, 90);
        this.road = this.removeInvalid(this.road, 83);
        this.unlocks = this.removeInvalid(this.unlocks, 9);
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

        this.itemDesigns = this.removeInvalid(this.itemDesigns, 36);
        this.city = this.removeInvalid(this.city, 22);
    }

    fillBlanksCs() {
        for (let i = 0; i < 15; i++) {
            this.unlocks[i] = this.unlocks[i] || false;
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

        for (let i = 1; i <= 60; i++) {
            this.city[i] = this.city[i] || false;
        }

        for (let i = 1; i <= 60; i++) {
            this.road[i] = this.road[i] || false;
        }

        for (let i = 1; i <= 100; i++) {
            this.itemDesigns[i] = this.itemDesigns[i] || false;
        }

        this.itemDesigns = this.removeInvalid(this.itemDesigns, 100);
        this.city = this.removeInvalid(this.city, 60);
        this.road = this.removeInvalid(this.road, 60);
        this.unlocks = this.removeInvalid(this.unlocks, 14);
    }

    fillRelations() {
        for (const uuid in this.characters) {
            if (!(this.characters[uuid] instanceof Character)) {
                this.characters[uuid] = Character.make(uuid, this.game);
                // Character was removed, remove it from sheet
                if (!this.characters[uuid].id) {
                    delete this.characters[uuid];
                }
            }
        }

        for (const uuid in this.archivedCharacters) {
            if (!(this.archivedCharacters[uuid] instanceof Character)) {
                this.archivedCharacters[uuid] = Character.make(uuid, this.game);
                // Character was removed, remove it from sheet
                if (!this.archivedCharacters[uuid].id) {
                    delete this.archivedCharacters[uuid];
                }
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

    fillDefaultCrossGameItems() {
        if (_.isEmpty(this.crossGameItems)) {
                this.crossGameItems = {
                'gh': false,
                'jotl': false,
                'cs': false,
            }
        }
    }

    removeInvalid(list, maxId) {
        return collect(list).filter((value, key) => key >= 0 && key <= maxId).all();
    }

    read() {
        this.parentRead();
        this.migrateCharacterUnlocks();

        switch (this.game) {
            case 'jotl':
                this.fillBlanksJotl();
                break;
            case 'cs':
                this.fillBlanksCs();
                break;
            default:
                this.fillBlanksGH();
                this.migrateEnvelopeXResult();
        }

        this.fillCharacterUnlocks();
        this.fillRelations();
        this.fillDefaultCrossGameItems();
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
        values.rift = collect({...this.rift}).filter(v => v).all();
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
            case 'cs':
                return ["BM", "BK", "CG", "CT", "FK", "HP", "HO", "LU", "MF", "ST"];
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

    // The key used in local storage
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
    parentStore: Storable.store,
});

Object.assign(Sheet.prototype, Versionable);

export default Sheet;
