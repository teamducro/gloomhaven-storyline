import Storable from './Storable'
import Character from "./Character";
import Helpers from "../services/Helpers";
import CharacterRepository from "../repositories/CharacterRepository";
import Versionable from "./Versionable";

class CampaignSheet {
    static make(game) {
        return new CampaignSheet({game: game});
    }

    constructor(data = {}) {
        this.version = data.version;
        this.hash = data.hash;

        // Sheet fields
        this.calendar = data.calendar || {
            week: 0,
            sections: {
                5: [32.3],
                10: [183.3, 21.4],
                20: [129.3],
                25: [183.3],
                30: [183.3],
                40: [184.1],
                60: [137.2],
            }
        };
        this.checks = {...data.checks};
        this.perks = {...data.perks};
        this.morale = data.morale || 0;
        this.resources = data.resources || {};
        this.soldiers = data.soldiers || 0;
        this.inspiration = data.inspiration || 0;
        this.totalDefense = data.totalDefense || 0;
        this.prosperityIndex = data.prosperityIndex || 1;
        this.summerRoad = {...data.summerRoad};
        this.summerOutpost = {...data.summerOutpost};
        this.winterRoad = {...data.winterRoad};
        this.winterOutpost = {...data.winterOutpost};
        this.notes = data.notes || '';
        this.unlocks = {...data.unlocks};

        // Items
        this.itemDesigns = {...data.itemDesigns};
        this.crossGameItemsEnabled = data.crossGameItemsEnabled || false;
        this.crossGameItems = {...data.crossGameItems};

        // Characters
        this.characterUnlocks = {...data.characterUnlocks};
        this.characters = {...data.characters};
        this.archivedCharacters = {...data.archivedCharacters};
        this.c = data.hidePersonalQuests || false;

        this.game = data.game;
        this.characterRepository = new CharacterRepository();

        this.fieldsToStore = {
            version: 'version',
            hash: 'hash',

            // Sheet fields
            calendar: {'calendar': {
                    week: 0,
                    sections: {
                        5: [32.3],
                        10: [183.3, 21.4],
                        20: [129.3],
                        25: [183.3],
                        30: [183.3],
                        40: [184.1],
                        60: [137.2],
                    }
                }},
            checks: {'checks': {}},
            perks: {'perks': {}},
            morale: 'morale',
            resources: {'resources': {}},
            soldiers: 'soldiers',
            inspiration: 'inspiration',
            totalDefense: 'totalDefense',
            prosperityIndex: 'prosperityIndex',
            summerRoad: {'summerRoad': {}},
            summerOutpost: {'summerOutpost': {}},
            winterRoad: {'winterRoad': {}},
            winterOutpost: {'winterOutpost': {}},
            notes: {'notes': ''},
            unlocks: {'unlocks': {}},

            // Items
            itemDesigns: {'itemDesigns': {}},
            crossGameItemsEnabled: 'crossGameItemsEnabled',
            crossGameItems: {'crossGameItems': {}},

            // Characters
            characterUnlocks: {'characterUnlocks': {}},
            characters: {'characters': {}},
            archivedCharacters: {'archivedCharacters': {}},
            hidePersonalQuests: 'hidePersonalQuests'
        };

        this.read();

        if (typeof app.campaignData[this.key()] === 'undefined') {
            this.new();
        }
    }

    new() {
        // Nothing to set up...
    }

    fillBlanksFH() {
        for (let i = 0; i <= 44; i++) {
            this.checks[i] = this.checks[i] || false;
        }

        for (let i = 1; i <= 30; i++) {
            this.summerRoad[i] = true;
        }

        for (let i = 1; i <= 30; i++) {
            this.summerOutpost[i] = true;
        }

        for (let i = 1; i <= 30; i++) {
            this.winterRoad[i] = true;
        }

        for (let i = 1; i <= 30; i++) {
            this.winterOutpost[i] = true;
        }
        
        for (let i = 51; i <= 119; i++) {
            this.itemDesigns[i] = this.itemDesigns[i] || false;
        }
        for (let i = 168; i <= 246; i++) {
            this.itemDesigns[i] = this.itemDesigns[i] || false;
        }
        for (let i = 248; i <= 264; i++) {
            this.itemDesigns[i] = this.itemDesigns[i] || false;
        }

        this.itemDesigns = this.removeInvalid(this.itemDesigns, 264);
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
        return collect(list).filter((value, key) => key >= 0 && key <= maxId).all();
    }

    read() {
        this.parentRead();

        this.fillBlanksFH();
        this.fillCharacterUnlocks();
        this.fillRelations();
        this.fillDefaultCrossGameItems();
    }

    valuesToStore() {
        let values = this.parentValuesToStore();
        values.checks = collect({...this.checks}).filter(v => v).all();
        values.perks = collect({...this.perks}).map(perks => (perks || []).filter(v => v)).filter(v => v.length).all();
        values.summerRoad = collect({...this.summerRoad}).filter(v => v).all();
        values.summerOutpost = collect({...this.summerOutpost}).filter(v => v).all();
        values.winterRoad = collect({...this.winterRoad}).filter(v => v).all();
        values.winterOutpost = collect({...this.winterOutpost}).filter(v => v).all();
        values.itemDesigns = collect({...this.itemDesigns}).filter(v => v).all();
        values.unlocks = collect({...this.unlocks}).filter(v => v).all();
        values.characterUnlocks = collect({...this.characterUnlocks}).filter(v => v).all();
        values.characters = collect({...this.characters}).mapWithKeys(character => [character.uuid, character.id]).all();
        values.archivedCharacters = collect({...this.archivedCharacters}).mapWithKeys(character => [character.uuid, character.id]).all();
        return values;
    }

    get starterCharacters() {
        switch (this.game) {
            default:
                return ["DF", "BB", "BN", "DW", "BO", "GE"];
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
        return 'sheet-' + this.game;
    }
}

Object.assign(CampaignSheet.prototype, {
    parentRead: Storable.read,
    parentValuesToStore: Storable.valuesToStore,
    parentStore: Storable.store,
});

Object.assign(CampaignSheet.prototype, Versionable);

export default CampaignSheet;
