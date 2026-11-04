import Storable from './Storable'
import Character from "./Character";
import Helpers from "../services/Helpers";
import CharacterRepository from "../repositories/CharacterRepository";
import Versionable from "./Versionable";

// Events added when a locked gh2 class is unlocked (revised campaign sheet / FAQ major errata)
const classEvents = {
    SK2: ['R-50', 'R-51'], QM2: ['R-47', 'C-78'], ST2: ['R-44', 'R-45'], NS2: ['R-46', 'C-81'],
    PH2: ['C-76', 'C-77'], BE2: ['C-73', 'R-40'], SS2: ['R-49', 'C-80'], DS2: ['C-74', 'C-75'],
    SB2: ['R-48', 'C-79'], EL2: ['R-42', 'R-43'], WF2: ['R-52', 'R-53'], BS2: ['R-54'],
};

class Sheet {

    static make(game) {
        return new Sheet({game: game});
    }

    constructor(data = {}) {
        this.version = data.version;
        this.hash = data.hash;

        // Sheet fields
        this.reputation = data.reputation || 0;
        this.donations = data.donations || 0;
        this.prosperityIndex = data.prosperityIndex || 1;
        this.city = {...data.city};
        this.road = {...data.road};
        this.rift = {...data.rift}; // FC
        this.notes = data.notes || '';
        this.unlocks = {...data.unlocks};
        this.scenarioLevel = data.scenarioLevel || 0;

        // GH2e
        this.factionReputation = {...data.factionReputation};
        this.inspiration = data.inspiration || 0;
        this.imbuement = data.imbuement || 0;

        // Gloomhaven edition played in this campaign (gh sheet only), 2 = GH2e
        this.edition = data.edition;

        // Items
        this.itemDesigns = {...data.itemDesigns};
        this.crossGameItemsEnabled = data.crossGameItemsEnabled || false;
        this.crossGameItems = {...data.crossGameItems};

        // Characters
        this.xResult = data.xResult || '';
        this.characterUnlocks = {...data.characterUnlocks};
        this.characters = {...data.characters};
        this.archivedCharacters = {...data.archivedCharacters};
        this.hidePersonalQuests = data.hidePersonalQuests || false;

        // Ability enhancements, keyed by character class id so they survive retirement.
        this.enhancementsEnabled = data.enhancementsEnabled || false;
        this.enhancements = {...data.enhancements};

        this.game = data.game;
        this.characterRepository = new CharacterRepository();

        this.fieldsToStore = {
            version: 'version',
            hash: 'hash',

            // Sheet fields
            reputation: 'reputation',
            donations: 'donations',
            prosperityIndex: 'prosperityIndex',
            city: {'city': {}},
            road: {'road': {}},
            rift: {'rift': {}},
            notes: {'notes': ''},
            unlocks: {'unlocks': {}},
            scenarioLevel: 'scenarioLevel',
            factionReputation: {'factionReputation': {}},
            inspiration: {'inspiration': 0},
            imbuement: {'imbuement': 0},
            edition: 'edition',

            // Items
            itemDesigns: {'itemDesigns': {}},
            crossGameItemsEnabled: 'crossGameItemsEnabled',
            crossGameItems: {'crossGameItems': {}},

            // Characters
            xResult: {'xResult': ''},
            characterUnlocks: {'characterUnlocks': {}},
            characters: {'characters': {}},
            archivedCharacters: {'archivedCharacters': {}},
            hidePersonalQuests: 'hidePersonalQuests',

            enhancementsEnabled: 'enhancementsEnabled',
            enhancements: {'enhancements': {}},
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

    // Item designs, event decks, campaign sheet unlocks and faction tracks for GH2e.
    fillBlanksGh2() {
        // Items 1–68 and 116 come from prosperity; the rest are unlocked by game effects.
        for (let i = 69; i <= 170; i++) {
            if (i !== 116) {
                this.itemDesigns[i] = this.itemDesigns[i] || false;
            }
        }
        this.itemDesigns = this.removeInvalid(this.itemDesigns, 170);

        // Starting decks C-01..C-20 and R-01..R-20
        if (!Object.keys(this.city).length) {
            for (let i = 1; i <= 20; i++) {
                this.city[i] = true;
            }
        }

        if (!Object.keys(this.road).length) {
            for (let i = 1; i <= 20; i++) {
                this.road[i] = true;
            }
        }

        for (let i = 1; i <= 100; i++) {
            this.city[i] = this.city[i] || false;
        }

        for (let i = 1; i <= 77; i++) {
            this.road[i] = this.road[i] || false;
        }

        for (let i = 0; i < 20; i++) {
            this.unlocks[i] = this.unlocks[i] || false;
        }

        this.factionReputation = {demons: 0, 'merchant-guild': 0, military: 0, ...this.factionReputation};

        this.city = this.removeInvalid(this.city, 100);
        this.road = this.removeInvalid(this.road, 77);
        this.unlocks = this.removeInvalid(this.unlocks, 19);
    }

    unlockClassEvents(id) {
        (classEvents[id] || []).forEach((event) => {
            const [type, number] = event.split('-');
            this[type === 'C' ? 'city' : 'road'][parseInt(number)] = true;
        });
    }

    fillRelations() {
        // Copies: read() shares these objects with app.campaignData, which must keep the unknown characters.
        this.characters = {...this.characters};
        this.archivedCharacters = {...this.archivedCharacters};
        this.unknownCharacters = {};
        this.unknownArchivedCharacters = {};
        Character.makeForSheet(this.characters, this.game, this.unknownCharacters);
        Character.makeForSheet(this.archivedCharacters, this.game, this.unknownArchivedCharacters);
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

        // Remove old character unlocks from party sheet, keys are ids now.
        // Hidden classes are kept, so switching games or editions doesn't lose their unlocks.
        const allCharacters = this.characterRepository.gameData.characters();
        this.characterUnlocks = _.each(this.characterUnlocks, (characterUnlock, id) => {
            if (!(id in allCharacters)) {
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
                'fh': false,
            }
        }
    }

    removeInvalid(list, maxId) {
        // Crossover packs (e.g. Mercenary Pack) use non-numeric ids like "AN1",
        // which the numeric range check below doesn't apply to; keep them as-is.
        return collect(list).filter((value, key) => isNaN(key) || (key >= 0 && key <= maxId)).all();
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
            case 'gh2':
                this.fillBlanksGh2();
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
        values.characters = {
            ...collect({...this.characters}).mapWithKeys(character => [character.uuid, character.id]).all(),
            ...this.unknownCharacters,
        };
        values.archivedCharacters = {
            ...collect({...this.archivedCharacters}).mapWithKeys(character => [character.uuid, character.id]).all(),
            ...this.unknownArchivedCharacters,
        };
        values.enhancements = collect({...this.enhancements}).map(perAbility =>
            collect(perAbility).filter(list => list.length).all()
        ).filter(perAbility => Object.keys(perAbility).length).all();

        // Left out while unset, so adding these fields doesn't change existing campaigns' sync hash.
        if (!Object.keys(values.enhancements).length) {
            delete values.enhancements;
        }
        if (!values.enhancementsEnabled) {
            delete values.enhancementsEnabled;
        }
        if (!values.hidePersonalQuests) {
            delete values.hidePersonalQuests;
        }
        if (!Object.values(values.factionReputation || {}).some(v => v)) {
            delete values.factionReputation;
        }
        if (!values.inspiration) {
            delete values.inspiration;
        }
        if (!values.imbuement) {
            delete values.imbuement;
        }
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
            case 'gh2':
                return ["BR2", "CH2", "MT2", "SC2", "SW2", "TI2"];
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
