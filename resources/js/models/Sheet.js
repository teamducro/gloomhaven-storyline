import Storable from './Storable'
import store from "store/dist/store.modern";
import Character from "./Character";
import Helpers from "../services/Helpers";
import CharacterRepository from "../repositories/CharacterRepository";
import Versionable from "./Versionable";
import DrawsEvents from "./DrawsEvents";
import GameData from "../services/GameData";
import DeckFiller from "../services/DeckFiller";
import SheetCalculations from "../services/SheetCalculations";
import AchievementRepository from "../repositories/AchievementRepository";

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
        // Item id => count removed from the game, e.g. sacrificed in a scenario.
        this.removedItems = {...data.removedItems};

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
            removedItems: {'removedItems': {}},

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
    }

    new() {
        // A new sheet counts donation checks automatically from the start, so it never needs the donation migration.
        app.campaignData[`migrated-donations-${this.key()}`] = true;
    }

    get donationChecks() {
        return SheetCalculations.methods.calculateDonationProsperity(this.donations || 0, this.game);
    }

    // prosperityIndex only holds the manually ticked boxes.
    get effectiveProsperityIndex() {
        return this.prosperityIndex + this.donationChecks;
    }

    // Item designs, event decks and campaign sheet unlocks, sized per game by `decks` in games/<game>.json.
    fillBlanks() {
        const decks = this.gameData.decks(this.game);

        this.itemDesigns = DeckFiller.fill(this.itemDesigns, decks.itemDesigns);

        if (decks.city) {
            this.city = DeckFiller.fill(this.city, decks.city);
            this.setAsideBonusEvents(decks.city.bonus || {});
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

    // Bonus events (pack => ids) are only on the sheet while their pack is enabled, otherwise kept aside so they survive.
    setAsideBonusEvents(bonus) {
        const enabled = this.gameData.enabledCrossovers();
        this.hiddenCity = {};
        Object.entries(bonus).forEach(([pack, ids]) => ids.forEach((id) => {
            if (enabled.includes(pack)) {
                this.city[id] = this.city[id] || false;
            } else if (id in this.city) {
                this.hiddenCity[id] = this.city[id];
                delete this.city[id];
            }
        }));
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
    addEvents(events) {
        events.forEach((event) => {
            const [deck, number] = this.eventKey(event);
            this[deck][number] = true;
        });
    }

    // GH2: faction reputation thresholds add events and gain reputation achievements; returns the gained achievement ids.
    applyFactionReputation() {
        const sections = this.gameData.sectionsGh2();

        // C-57 joins the city deck the first time any faction reaches 13 (errata).
        const {unlock, reputation, events} = sections.anyFactionReputation;
        if (!this.unlocks[unlock] && Object.values(this.factionReputation).some(value => value >= reputation)) {
            this.unlocks[unlock] = true;
            this.addEvents(events);
        }

        sections.reputation9Events.forEach(([faction, unlock, events]) => {
            if (!this.unlocks[unlock] && this.factionReputation[faction] >= 9) {
                this.unlocks[unlock] = true;
                this.addEvents(events);
            }
        });

        // Gain only: once the section is read, losing reputation doesn't re-lock its scenarios.
        const achievementRepository = new AchievementRepository();
        const reached = sections.reputationAchievements.filter(([faction, value, id]) => !achievementRepository.find(id)?.awarded
            && Object.entries(this.factionReputation).some(([f, v]) => (!faction || f === faction) && v >= value));
        reached.forEach(([, , id]) => achievementRepository.gain(id));

        return reached.map(([, , id]) => id);
    }

    // GH2: adds the events of each prosperity box crossed since `fromIndex`. Only when crossing the box:
    // the sections have no sheet checkbox to remember they were read.
    addProsperityEvents(fromIndex) {
        Object.entries(this.gameData.sectionsGh2().prosperityEvents)
            .filter(([box]) => fromIndex < box && this.effectiveProsperityIndex >= box)
            .forEach(([, events]) => this.addEvents(events));
    }

    // Bonus events are only on the sheet while their pack is enabled, so this tells whether their content is in play.
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

    // Runs on campaign load (migrateSheets), not in read(): a page can build a sheet before the campaign is loaded.
    migrate() {
        this.migrateClassEventsAdded();
        if (this.game === 'cs') {
            this.migrateCsItemDesigns();
        }
    }

    // Before #378 some Crimson Scales rewards and treasures named Gloomhaven items as CS designs, or the wrong CS design.
    migrateCsItemDesigns() {
        if (!this.shouldMigrate('cs-designs')) {
            return;
        }

        const scenario = id => app.campaignData['scenario-cs-' + id] || {};
        const isComplete = id => scenario(id).state === 'complete';
        const looted = Object.entries(app.campaignData)
            .filter(([key, value]) => key.startsWith('scenario-cs-') && value)
            .flatMap(([, value]) => (value.treasures || []).map(Number));
        const isLooted = id => looted.includes(id);
        const wrong = [
            [isComplete(6), [21]],
            [isComplete(10), [12, 20]],
            [isComplete(13), [34, 41, 48]],
            [isComplete(14), [86]],
            [isComplete(19), [48]],
            [isComplete(21), [99]],
            [isComplete(33), [87]],
            [isComplete('RM5') && Number(scenario('RM5').promptChoice) === 1, [30, 36]],
            [isComplete('RM5') && Number(scenario('RM5').promptChoice) === 2, [63]],
            [isLooted(1) || isLooted(31), [14]],
            [isLooted(49), [99]],
        ].filter(([applies]) => applies).flatMap(([, ids]) => ids);
        // Still rewarded by a completed scenario; treasures are granted again by the TreasureValidator.
        const rewarded = {20: 8, 34: 58, 41: 65, 48: 57};
        const granted = [[isComplete(14), 88], [isComplete(33), 90]].filter(([applies]) => applies).map(([, id]) => id);
        wrong.filter(id => !isComplete(rewarded[id])).forEach(id => this.itemDesigns[id] = false);
        granted.forEach(id => this.itemDesigns[id] = true);
        if (wrong.length || granted.length) {
            this.store();
        }
    }

    // Campaigns from before automatic class events added them by hand: count the classes in play as done, so they aren't added twice.
    migrateClassEventsAdded() {
        if (!this.shouldMigrate('class-events') || Object.keys(this.classEventsAdded).length) {
            return;
        }

        const played = (characters, unknown) => [...Object.values(characters).map(character => character.id), ...Object.values(unknown)];
        const retired = played(this.archivedCharacters, this.unknownArchivedCharacters);
        const unlocked = [
            ...Object.keys(this.characterUnlocks).filter(id => this.characterUnlocks[id] && !this.starterCharacters.includes(id)),
            ...played(this.characters, this.unknownCharacters),
            ...retired,
        ];
        unlocked.forEach(id => this.classEventsAdded[id] = ['unlock']);
        retired.forEach(id => this.classEventsAdded[id] = ['unlock', 'retire']);
        if (unlocked.length) {
            this.store();
        }
    }

    // True once per campaign: the marker is a top-level key, like migrateDonationProsperity's, so older clients keep it.
    shouldMigrate(name) {
        const marker = `migrated-${name}-${this.key()}`;
        if (app.campaignData[marker]) {
            return false;
        }
        app.campaignData[marker] = true;
        store.set(app.campaignId, app.campaignData);
        return true;
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
        values.city = collect({...this.city, ...this.hiddenCity}).filter(v => v).all();
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
        if (!Object.keys(values.removedItems || {}).length) {
            delete values.removedItems;
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
Object.assign(Sheet.prototype, DrawsEvents);

export default Sheet;
