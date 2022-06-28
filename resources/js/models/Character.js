import Storable from './Storable'
import GameData from "../services/GameData";
import PersonalQuestRepository from "../repositories/PersonalQuestRepository";
import PersonalQuest from "./PersonalQuest";
import UsesTranslations from "./UsesTranslations";
import Versionable from "./Versionable";

class Character {

    static make(uuid, sheet_game, id) {
        return new Character({uuid, sheet_game, id});
    }

    constructor(data = {}) {
        this.uuid = data.uuid;
        this.id = data.id;
        this.version = data.version;
        this.hash = data.hash;
        this.name = data.name;
        this.characterName = null; // from translations
        this.perkDescriptions = [];
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.gold = data.gold || 0;
        this.retirements = data.retirements || 0;
        this.items = {...data.items};
        this.notes = data.notes || '';
        this.checks = {...data.checks};
        this.perks = {...data.perks};
        this.quest = {...data.quest};
        this.abilities = {...data.abilities};
        this.abilityCount = 0; // from characters.json
        this.sheet_game = data.sheet_game;
        this.game = null; // from characters.json
        this.gameData = new GameData;
        this.personalQuestRepository = new PersonalQuestRepository;
        this.translationKey = '';

        this.fieldsToStore = {
            uuid: 'uuid',
            id: 'id',
            version: 'version',
            hash: 'hash',
            name: 'name',
            level: 'level',
            xp: 'xp',
            gold: 'gold',
            retirements: 'retirements',
            items: {'items': {}},
            notes: 'notes',
            checks: {'checks': {}},
            perks: {'perks': {}},
            quest: {'quest': {}},
            abilities: {'abilities': {}},
        };

        this.read();

        if (this.id && this.sheet_game && !this.name) {
            this.new();
        }
    }

    new() {
        this.name = this.characterName;
    }

    readGameData() {
        this.characterName = this.$tPrefix('name');
        if (this.id) {
            const data = this.gameData.characters(this.game)[this.id];
            this.perkDescriptions = data.perks;
            this.game = data.game;
            this.abilityCount = data.abilityCount;
        }
    }

    fillBlanks() {
        for (let i = 0; i <= 17; i++) {
            this.checks[i] = this.checks[i] || false;
        }

        this.perkDescriptions.forEach((perk, index) => {
            perk.desc = this.$tPrefix('perks.' + index);
            for (let i = 0; i < perk.count; i++) {
                this.perks[index] = this.perks[index] || [];
                this.perks[index][i] = this.perks[index][i] || false;
            }
        })
    }

    fillRelations() {
        if (this.quest.id && !(this.quest instanceof PersonalQuest)) {
            this.quest = this.personalQuestRepository.make(this.quest);
        }
    }

    read() {
        this.parentRead();
        this.translationKey = 'characters.' + this.id;
        this.readGameData();
        this.fillBlanks();
        this.fillRelations();
    }

    valuesToStore() {
        let values = this.parentValuesToStore();
        values.checks = collect({...this.checks}).filter(v => v).all();
        values.perks = collect({...this.perks}).map(perks => (perks || []).filter(v => v)).filter(v => v.length).all();
        values.items = collect({...this.items}).filter(v => v).all();
        values.quest = this.quest instanceof PersonalQuest ? this.quest.valuesToStore() : {};
        return values;
    }

    key() {
        return 'character-' + this.uuid;
    }
}

Object.assign(Character.prototype, {
    parentRead: Storable.read,
    parentValuesToStore: Storable.valuesToStore,
    parentStore: Storable.store,
    delete: Storable.delete,
});

Object.assign(Character.prototype, UsesTranslations);
Object.assign(Character.prototype, Versionable);

export default Character;
