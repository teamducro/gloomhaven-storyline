import Storable from './Storable'
import Character from "./Character";
import GameData from "../services/GameData";
import Helpers from "../services/Helpers";
import DeckFiller from "../services/DeckFiller";
import CharacterRepository from "../repositories/CharacterRepository";
import BuildingRepository from "../repositories/BuildingRepository";
import Versionable from "./Versionable";
import SheetCalculations from "../services/SheetCalculations";
import ModifierCard from "./ModifierCard";
import UsesTranslations from "./UsesTranslations";

class CampaignSheet {
    static make(game) {
        return new CampaignSheet({game: game});
    }

    constructor(data = {}) {
        this.version = data.version;
        this.hash = data.hash;

        // Sheet fields
        // New campaigns start with the printed calendar sections (fh.json rules), players can add and remove them.
        this.calendar = data.calendar || {week: 0, sections: _.cloneDeep(new GameData().campaignRule('fh', 'calendarSections'))};
        this.checks = {...data.checks};
        this.perks = {...data.perks};
        this.perkDescriptions = [];
        this.morale = data.morale || 0;
        this.resources = data.resources || {};
        this.soldiers = data.soldiers ?? 4;
        this.inspiration = data.inspiration || 0;
        this.totalDefense = data.totalDefense || 0;
        this.prosperityIndex = data.prosperityIndex || 1;
        this.summerRoad = {...data.summerRoad};
        this.summerOutpost = {...data.summerOutpost};
        this.winterRoad = {...data.winterRoad};
        this.winterOutpost = {...data.winterOutpost};
        this.boat = {...data.boat};
        this.notes = data.notes || '';
        // Event deck card ids top to bottom, per card type.
        this.deckOrder = {...data.deckOrder};
        this.unlocks = {...data.unlocks};
        this.scenarioLevel = data.scenarioLevel || 0;

        // Items
        this.itemDesigns = {...data.itemDesigns};
        this.crossGameItemsEnabled = data.crossGameItemsEnabled || false;
        this.crossGameItems = {...data.crossGameItems};
        this.recipes = {...data.recipes};

        // Characters
        this.characterUnlocks = {...data.characterUnlocks};
        this.characters = {...data.characters};
        this.archivedCharacters = {...data.archivedCharacters};
        this.hidePersonalQuests = data.hidePersonalQuests || false;

        // Ability enhancements, keyed by character class id so they survive retirement.
        this.enhancementsEnabled = data.enhancementsEnabled || false;
        this.enhancements = {...data.enhancements};

        this.translationKey = '';
        this.game = data.game;
        this.characterRepository = new CharacterRepository;
        this.buildingRepository = new BuildingRepository;
        this.gameData = new GameData;

        this.fieldsToStore = {
            version: 'version',
            hash: 'hash',

            // Sheet fields
            calendar: {'calendar': {week: 0, sections: _.cloneDeep(new GameData().campaignRule('fh', 'calendarSections'))}},
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
            boat: {'boat': {}},
            notes: {'notes': ''},
            deckOrder: {'deckOrder': {}},
            unlocks: {'unlocks': {}},
            scenarioLevel: 'scenarioLevel',

            // Items
            itemDesigns: {'itemDesigns': {}},
            crossGameItemsEnabled: 'crossGameItemsEnabled',
            crossGameItems: {'crossGameItems': {}},
            recipes: {'recipes': {}},

            // Characters
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

    get effectiveProsperityIndex() {
        return this.prosperityIndex;
    }

    new() {
        // Nothing to set up...
    }

    readGameData() {
        const data = this.gameData.townGuard(this.game);

        this.perkDescriptions = data.perks.map((perk) => {
            perk.cards = perk.cards?.map((card) => {
                if (card instanceof ModifierCard) {
                    return card;
                }

                return new ModifierCard({
                    path: 'town-guard',
                    count: card.count,
                    ...card.attackModifier
                })
            });

            return perk;
        });
    }

    fillBlanksFH() {
        for (let i = 0; i <= 44; i++) {
            this.checks[i] = this.checks[i] || false;
        }

        const decks = this.gameData.decks(this.game);

        ['summerRoad', 'summerOutpost', 'winterRoad', 'winterOutpost', 'boat'].forEach((deck) => {
            this[deck] = DeckFiller.fill(this[deck], decks[deck]);
        });

        this.itemDesigns = DeckFiller.fill(this.itemDesigns, decks.itemDesigns);

        this.perkDescriptions.forEach((perk, index) => {
            perk.desc = this.$tPrefix('town_guard_perks.' + index);
            for (let i = 0; i < perk.count; i++) {
                this.perks[index] = this.perks[index] || [];
                this.perks[index][i] = this.perks[index][i] || false;
            }
        })
    }

    // Frosthaven classes add no events when unlocked or retired.
    addClassEvents() {
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

    fillRelations() {
        // Copies: read() shares these objects with app.campaignData, which must keep the unknown characters.
        this.characters = {...this.characters};
        this.archivedCharacters = {...this.archivedCharacters};
        this.unknownCharacters = {};
        this.unknownArchivedCharacters = {};
        Character.makeForSheet(this.characters, this.game, this.unknownCharacters);
        Character.makeForSheet(this.archivedCharacters, this.game, this.unknownArchivedCharacters);
    }

    resetCrossGameItems() {
        this.crossGameItems = {
            gh: {},
            jotl: {},
            cs: {}
        }
    }

    fillDefaultCrossGameItems() {
        if (_.isEmpty(this.crossGameItems)) {
            this.resetCrossGameItems();
        }
        else if (typeof this.crossGameItems['gh'] !== 'object') {
            this.resetCrossGameItems();

            // Check if any characters have some cross-game items that should transfer over
            collect(this.characters).each((character) => {
                collect(character.items).each((available, itemId) => {
                    const splitIndex = itemId.indexOf('-');
                    const itemGame = itemId.substring(0, splitIndex);
                    if (itemGame !== 'fh') {
                        const itemNumber = itemId.slice(splitIndex + 1)
                        this.crossGameItems[itemGame][itemNumber] = true;
                    }
                });
            });
        }

        // Fill cross game items from unlocked buildings
        SheetCalculations.methods.calculateCrossGhItems(this.buildingRepository)
            .forEach((itemId) => {
                this.crossGameItems.gh[itemId] = this.crossGameItems.gh[itemId] || false;
            });
    }

    read() {
        this.parentRead();

        this.translationKey = 'campaign_sheet.' + this.game;
        this.readGameData();
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
        values.recipes = collect({...this.recipes}).filter(v => v).all();
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
        if (!Object.keys(values.deckOrder || {}).length) {
            delete values.deckOrder;
        }
        if (!values.hidePersonalQuests) {
            delete values.hidePersonalQuests;
        }
        return values;
    }

    get starterCharacters() {
        return this.gameData.startingClasses(this.game);
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

    // Weeks 1-10 are summer, 11-20 winter
    static isSummerWeek(week) {
        const remainder = week % 20;
        return remainder > 0 && remainder <= 10;
    }

    // calendar.week is the number of crossed off weeks, so the current week is the next one
    isSummer() {
        return CampaignSheet.isSummerWeek(this.calendar.week + 1);
    }

    // The key used in local storage
    key() {
        return 'campaign-' + this.game;
    }
}

Object.assign(CampaignSheet.prototype, {
    parentRead: Storable.read,
    parentValuesToStore: Storable.valuesToStore,
    parentStore: Storable.store,
});

Object.assign(CampaignSheet.prototype, UsesTranslations);
Object.assign(CampaignSheet.prototype, Versionable);

export default CampaignSheet;
