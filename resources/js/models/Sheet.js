import Storable from './Storable'
import Character from "./Character";
import Helpers from "../services/Helpers";
import CharacterRepository from "../repositories/CharacterRepository";
import Versionable from "./Versionable";
import GameData from "../services/GameData";
import DeckFiller from "../services/DeckFiller";
import SheetCalculations from "../services/SheetCalculations";

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
        this.autoDonationProsperity = data.autoDonationProsperity;
        this.prosperityIndex = data.prosperityIndex || 1;
        this.city = {...data.city};
        this.road = {...data.road};
        this.rift = {...data.rift}; // FC
        this.notes = data.notes || '';
        // Event deck card ids top to bottom, per card type.
        this.deckOrder = {...data.deckOrder};
        this.unlocks = {...data.unlocks};
        this.scenarioLevel = data.scenarioLevel || 0;

        // Drawn event cards: [{card: 'C-12', choice: 'A', removed: false, date: ISO string}]
        this.eventHistory = [...(data.eventHistory || [])];

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

        // Class ids => ['unlock', 'retire'], the class events already added, so they're added once.
        this.classEventsAdded = {...data.classEventsAdded};

        this.game = data.game;
        this.characterRepository = new CharacterRepository();
        this.gameData = new GameData();

        this.fieldsToStore = {
            version: 'version',
            hash: 'hash',

            // Sheet fields
            reputation: 'reputation',
            donations: 'donations',
            autoDonationProsperity: 'autoDonationProsperity',
            prosperityIndex: 'prosperityIndex',
            city: {'city': {}},
            road: {'road': {}},
            rift: {'rift': {}},
            notes: {'notes': ''},
            deckOrder: {'deckOrder': {}},
            unlocks: {'unlocks': {}},
            scenarioLevel: 'scenarioLevel',
            eventHistory: {'eventHistory': []},
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
            classEventsAdded: {'classEventsAdded': {}},
        };

        this.read();

        if (typeof app.campaignData[this.key()] === 'undefined') {
            this.new();
        }

        this.migrateDonationProsperity();
    }

    new() {
        // Nothing to set up..
    }

    get donationChecks() {
        return SheetCalculations.methods.calculateDonationProsperity(this.donations || 0, this.game);
    }

    // prosperityIndex only holds the manually ticked boxes.
    get effectiveProsperityIndex() {
        return this.prosperityIndex + this.donationChecks;
    }

    // Older campaigns ticked donation boxes by hand, so move them out of prosperityIndex to keep the total unchanged.
    migrateDonationProsperity() {
        if (this.autoDonationProsperity) {
            return;
        }

        this.prosperityIndex = Math.max(1, (this.prosperityIndex || 1) - this.donationChecks);
        this.autoDonationProsperity = true;
    }

    // Item designs, event decks and campaign sheet unlocks, sized per game by `decks` in games/<game>.json.
    fillBlanks() {
        const decks = this.gameData.decks(this.game);

        this.itemDesigns = DeckFiller.fill(this.itemDesigns, decks.itemDesigns);

        if (decks.city) {
            this.city = DeckFiller.fill(this.city, decks.city);
        }

        if (decks.road) {
            this.road = DeckFiller.fill(this.road, decks.road);
        }

        if (decks.rift) {
            this.rift = DeckFiller.fill(this.rift, decks.rift);
        }

        if (decks.unlocks) {
            this.unlocks = DeckFiller.fillUnlocks(this.unlocks, decks.unlocks);
        }
    }

    // moment: 'unlock' when a class is unlocked (or a Crimson Scales starting class is chosen), 'retire' when it retires.
    addClassEvents(id, moment) {
        const added = this.classEventsAdded[id] || [];
        if (added.includes(moment)) {
            return;
        }

        // Only a campaign's own classes add events: a crossover class's numbers refer to its own game's decks.
        const events = this.gameData.classEvents(this.game === 'fc' ? 'gh' : this.game)[id]?.[moment] || [];
        if (!events.length) {
            return;
        }

        this.addEvents(events);
        this.classEventsAdded[id] = [...added, moment];
    }

    // Events as 'C-57' / 'R-21'; bonus content uses string numbers like 'C-SoX1'.
    // inDeck false only makes the event addable (unless it is already in the deck).
    addEvents(events, inDeck = true) {
        events.forEach((event) => {
            const [deck, number] = this.eventKey(event);
            this[deck][number] = inDeck || this[deck][number] || false;
        });
    }

    // Bonus events only exist on the sheet once added, so this tells whether their content is in play.
    hasEvent(event) {
        const [deck, number] = this.eventKey(event);
        return this[deck][number] !== undefined;
    }

    eventKey(event) {
        const decks = {C: 'city', R: 'road'};
        const [type, number] = event.split('-');
        if (!decks[type]) {
            throw new Error(`Unknown event type: ${event}`);
        }
        return [decks[type], isNaN(number) ? number : parseInt(number)];
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

    read() {
        this.parentRead();
        this.migrateCharacterUnlocks();

        this.fillBlanks();

        switch (this.game) {
            case 'jotl':
            case 'cs':
                break;
            case 'gh2':
                this.factionReputation = {demons: 0, 'merchant-guild': 0, military: 0, ...this.factionReputation};
                break;
            default:
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
        // Bonus events (e.g. 'SoX1') aren't refilled by the deck spec, so they're kept once known, even when out of the deck.
        values.city = collect({...this.city}).filter((v, id) => v || isNaN(id)).all();
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
        if (!Object.keys(values.deckOrder || {}).length) {
            delete values.deckOrder;
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
        if (!Object.keys(values.classEventsAdded || {}).length) {
            delete values.classEventsAdded;
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
