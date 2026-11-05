import Storable from './Storable'
import GameData from "../services/GameData";
import PersonalQuestRepository from "../repositories/PersonalQuestRepository";
import PersonalQuest from "./PersonalQuest";
import UsesTranslations from "./UsesTranslations";
import Versionable from "./Versionable";
import ModifierCard from "./ModifierCard";
import {Game} from "./Game";

class Character {

    static make(uuid, sheet_game, id) {
        return new Character({uuid, sheet_game, id});
    }

    // Turns a sheet's stored {uuid: id} map into Characters. Removed characters are dropped; unknown classes are
    // moved to `unknown` so the sheet can store them again without showing them.
    static makeForSheet(characters, sheet_game, unknown) {
        for (const uuid in characters) {
            if (characters[uuid] instanceof Character) {
                continue;
            }

            const character = Character.make(uuid, sheet_game);
            if (character.isUnknownClass) {
                unknown[uuid] = character.id;
            }
            if (character.id && !character.isUnknownClass) {
                characters[uuid] = character;
            } else {
                delete characters[uuid];
            }
        }
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
        this.resources = data.resources || {
            lumber: 0,
            metal: 0,
            hide: 0,
            arrowvine: 0,
            axenut: 0,
            corpsecap: 0,
            flamefruit: 0,
            rockroot: 0,
            snowthistle: 0
        };
        this.retirements = data.retirements || 0;
        this.items = {...data.items};
        this.notes = data.notes || '';
        this.checks = {...data.checks};
        this.masteries = {...data.masteries};
        this.perks = {...data.perks};
        this.quest = {...data.quest};
        this.abilities = {...data.abilities};
        this.abilityPerLevel = {...data.abilityPerLevel};
        this.abilityCount = 0; // from characters.json
        this.sheet_game = data.sheet_game;
        this.game = null; // from characters.json
        this.gameData = new GameData;
        this.personalQuestRepository = new PersonalQuestRepository;
        this.translationKey = '';
        this.sortOrder = data.sortOrder;

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
            resources: {'resources': {}},
            notes: 'notes',
            checks: {'checks': {}},
            masteries: {'masteries': {}},
            perks: {'perks': {}},
            quest: {'quest': {}},
            abilities: {'abilities': {}},
            abilityPerLevel: {'abilityPerLevel': {}},
            sortOrder: 'sortOrder',
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

            this.game = data.game;
            this.abilityCount = data.abilityCount;
            this.masteryDescriptions = (data.masteries || []).map((mastery, index) => this.$tPrefix('masteries.' + index));

            this.perkDescriptions = data.perks.map((perk) => {
                perk.cards = perk.cards?.map((card) => {
                    if (card instanceof ModifierCard) {
                        return card;
                    }

                    return new ModifierCard({
                        path: this.id,
                        count: card.count,
                        ...card.attackModifier
                    })
                });

                return perk;
            });
        }
    }

    migrateItemIds() {
        Object.keys(this.items).forEach(id => {
            if (!isNaN(id)) {
                this.items[this.game + '-' + id] = this.items[id];
                delete this.items[id];
            }
        });
    }

    fillBlanks() {
        for (let i = 0; i <= 17; i++) {
            this.checks[i] = this.checks[i] || false;
        }

        if (this.masteryDescriptions) {
            this.masteryDescriptions.forEach((mastery, index) => {
                this.masteries[index] = this.masteries[index] || false;
            });
        }

        this.perkDescriptions.forEach((perk, index) => {
            perk.desc = this.$tPrefix('perks.' + index);
            for (let i = 0; i < perk.count; i++) {
                this.perks[index] = this.perks[index] || [];
                this.perks[index][i] = this.perks[index][i] || false;
            }
        })

        for (let i = 2; i <= 9; i++) {
            this.abilityPerLevel[i] = this.abilityPerLevel[i] || null;
        }
    }

    fillRelations() {
        if (this.quest.id && !(this.quest instanceof PersonalQuest)) {
            this.quest = this.personalQuestRepository.make(this.quest);
        }
    }

    read() {
        this.parentRead();

        // A class unknown to this version (e.g. stored by a newer one) can't be shown, but must survive a store.
        this.isUnknownClass = !!this.id && !this.gameData.characters(this.game)[this.id];
        if (this.isUnknownClass) {
            return;
        }

        this.sortOrder = this.sortOrder || 0;
        this.translationKey = 'characters.' + this.id;
        this.readGameData();
        this.migrateItemIds();
        this.fillBlanks();
        this.fillRelations();
    }

    valuesToStore() {
        let values = this.parentValuesToStore();
        values.checks = collect({...this.checks}).filter(v => v).all();
        values.masteries = collect({...this.masteries}).filter(v => v).all();
        values.perks = collect({...this.perks}).map(perks => (perks || []).filter(v => v)).filter(v => v.length).all();
        values.items = collect({...this.items}).filter(v => v).all();
        values.quest = this.quest instanceof PersonalQuest ? this.quest.valuesToStore() : {};
        return values;
    }

    get hasAbilities() {
        return this.abilityCount > 0;
    }

    // No mat scans available yet for these Mercenary Pack characters.
    get hasMat() {
        return !['SA', 'CA', 'AN'].includes(this.id);
    }

    get matImages() {
        return ['front', 'back'].map(side => `/img/character-mats/${this.game}/${this.id}-${side}.jpg`);
    }

    get artImage() {
        return `/img/character-mats/${this.game}/${this.id}-art.jpg`;
    }

    get hasPortraitMat() {
        return this.game === Game.jotl;
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
