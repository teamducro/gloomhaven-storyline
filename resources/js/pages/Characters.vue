<template>
    <div v-if="sheet" :key="sheetHash" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div id="characters" class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party min-h-screen">

            <template v-if="character && selected && !abilities && character.hasMat">
                <div id="character-art" @click="openCharacterMat" aria-hidden="true"
                     class="character-art-hover hidden sm:block absolute top-0 right-0 z-1 w-80 h-32 cursor-pointer"></div>
                <!-- Same position and size as the add character button, one row below it -->
                <div class="character-art-touch character-art-hover absolute right-0 top-0 mt-[7.5rem] sm:mt-20 mr-4 z-5">
                    <button id="character-art-button" type="button" :title="$t('Character mat')"
                            @click="openCharacterMat"
                            class="mdc-icon-button mdc-button--raised material-icons p-2 mr-2 mt-2 bg-dark-gray2-75! rounded-full">
                        open_in_full
                    </button>
                </div>
                <webp :key="character.artImage" :src="character.artImage" alt=""
                      class="character-art absolute top-0 right-0 w-56 sm:w-80 rounded-tr-lg"/>
            </template>

            <tabs v-if="sheet.game === Game.fh" class="hidden sm:block sm:w-max relative z-1"
                  :tabs="[$t('Campaign sheet'), $t('Characters'), $t('Items'), $t('Buildings')]"
                  :icons="['assignment', 'person', 'style', 'home']"
                  :urls="['party', 'characters', 'items', 'buildings']"
                  :active="$t('Characters')"
            />
            <tabs v-else class="hidden sm:block sm:w-max relative z-1"
                  :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Characters')"
            />
            
            <h1 class="hidden sm:inline-block relative z-1 mt-4 text-xl">{{ campaignName }}
                <span v-if="character && selected"
                      class="pl-6">{{ $t(character.characterName) }}</span>
                <span v-if="abilities"
                      class="pl-6">{{ $t('Abilities') }}</span>
            </h1>

            <add-character v-if="!appData.read_only" ref="add-character" :sheet="sheet" @create="create"/>

            <div class="sm:mt-4 sm:flex">
                <character-menu :selected="selected" :abilities="abilities" :sheet="sheet" @select="select"
                                @store="store" :is-local-campaign="isLocalCampaign"/>

                <div v-if="character && !abilities" class="w-full relative sm:ml-8"
                     :class="{'opacity-25': !selected}">
                    <div class="character-sheet flex flex-col">
                        <div class="w-full">
                            <div v-if="!selected" @click.stop="() => {$refs['add-character'].open()}"
                                 class="absolute z-1 top-0 right-0 bottom-0 left-0 cursor-pointer">
                            </div>

                            <div class="mb-4">
                                <h2 class="mb-2">{{ $t('Name') }}</h2>
                                <text-field id="name" ref="name-field" :label="$t('Name')"
                                            v-model:value="nameText" @change="store"></text-field>
                            </div>

                            <div class="flex flex-wrap">
                                <div class="mb-4 mr-4">
                                    <div class="mb-2 flex items-center">
                                        <h2>{{ $t('Level') }}</h2>
                                        <rollback v-show="!loading" ref="level-rollback"
                                                  v-model:value="character.level"></rollback>
                                    </div>
                                    <number-field class="w-14" v-model:value="character.level" :min="1" :max="9"
                                                  id="level"
                                                  @change="store"></number-field>
                                </div>
                                <div class="mb-4 mr-4">
                                    <div class="mb-2 flex items-center">
                                        <h2>{{ $t('XP') }}</h2>
                                        <rollback v-show="!loading" ref="xp-rollback"
                                                  v-model:value="character.xp"></rollback>
                                    </div>
                                    <number-field v-model:value="character.xp" :min="0" :max="9999" id="xp"
                                                  @change="store"></number-field>
                                </div>
                                <div class="mb-4">
                                    <div class="mb-2 flex items-center">
                                        <h2>{{ $t('Gold') }}</h2>
                                        <rollback v-show="!loading" ref="gold-rollback"
                                                  v-model:value="character.gold"></rollback>
                                    </div>
                                    <number-field v-model:value="character.gold" :min="0" :max="9999" id="gold"
                                                  @change="store"></number-field>
                                </div>

                                <level-progress-bar :level="character.level" :xp="character.xp"/>
                            </div>

                            <resources-section v-if="sheet.game === Game.fh"
                                ref="resources"
                                v-model:resources="character.resources"
                                :loading="loading"
                                @change="store"/>

                            <selectable-list
                                id="items"
                                :title="$t('Items')"
                                :label="$t('Search name or nr')"
                                v-model:items="sheetItems"
                                :disabled="outOfStockItems"
                                :filter-closure="itemFilterClosure"
                                :animations="false"
                                width="w-auto"
                                class="mb-2"
                                @change="storeItems"
                                ref="items"
                            >
                                <template #label="{item}">
                                    <span class="flex items-center mr-6"
                                          v-if="items[item]">
                                        <webp :src="items[item].slot" width="20" class="mr-2"/>
                                        <span>{{ items[item].number }} {{ $t(items[item].name) }}</span>
                                    </span>
                                </template>
                                <template #item="{item}">
                                    <div
                                         class="cursor-pointer flex items-center border-b border-white2-50 py-1"
                                         v-if="items[item]" @click="openItemModel(item)">
                                        <webp :src="items[item].slot" width="20" class="mr-2"/>
                                        <span>{{ items[item].number }} {{ $t(items[item].name) }}</span>
                                        <span @click.stop="$refs.items.deselect(item)"
                                              class="ml-auto material-icons">clear</span>
                                    </div>
                                </template>
                            </selectable-list>

                            <router-link to="/items">
                                <button class="mb-8 mdc-button origin-left transform scale-90 mdc-button--raised pr-1">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon transform rotate-180">style</i>
                                    <span class="mdc-button__label">{{ $t('Items') }} 〉</span>
                                </button>
                            </router-link>

                            <personal-quests v-model:quest="character.quest"
                                             :sheet="sheet"
                                             @change="store"/>

                            <h2 class="mb-2">{{ $t('Additional notes') }}</h2>
                            <notes v-model:value="character.notes" id="notes" :label="$t('Notes')"
                                   @change="store" :is-local-campaign="isLocalCampaign"
                            ></notes>

                        </div>
                        <div class="character-sheet-right w-full mt-8 sheet-break-lg:mt-0">

                            <perks v-model:checks="character.checks"
                                   v-model:perks="character.perks"
                                   v-model:masteries="character.masteries"
                                   :character="character"
                                   :scenario-perks="scenarioPerks"
                                   @change="store"/>

                            <div class="flex mt-4 space-x-12">
                                <attack-modifier-deck v-if="character.game !== Game.cs"
                                                      :perks="character.perks"
                                                      :perkDescriptions="character.perkDescriptions"
                                                      :character="character"
                                                      :playerIndex="playerIndex"/>

                                <card-stack v-if="character.hasAbilities" @click="selectAbilities(character.uuid, true)" :src="abilityBackImage()"
                                            :width="20" class="cursor-pointer"/>
                            </div>

                            <div v-if="soloScenario" :key="'solo-'+soloScenario.id" class="my-5 flex">
                                <span class="font-title mr-2">{{ $t('Solo') }}:</span>
                                <scenario-number :scenario="soloScenario" show-name/>
                            </div>
                        </div>

                        <div>
                            <div class="mt-8">
                                <div class="mb-2 flex items-center">
                                    <h2>{{ $t('Retirement counter') }}</h2>
                                    <rollback v-show="!loading" ref="level-rollback"
                                              v-model:value="character.retirements"></rollback>
                                </div>
                                <number-field v-model:value="character.retirements" :min="0" :max="20"
                                              id="retirements" @change="store"></number-field>
                                <p class="text-sm">
                                    {{ $t('Set this counter to the amount of characters you have retired') }}
                                </p>
                            </div>

                            <div class="my-8">
                                <button v-if="!isArchived" @click="$refs['retire-character'].open()" type="button"
                                        class="mr-4 mdc-button mdc-button--raised" :disabled="appData.read_only">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon" aria-hidden="true">military_tech</i>
                                    <span class="mdc-button__label">{{ $t('Retire') }}</span>
                                </button>
                                <button v-if="!isArchived" @click="$refs['abandon-character'].open()" type="button"
                                        class="mr-4 mdc-button mdc-button--raised" :disabled="appData.read_only">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon" aria-hidden="true">person_off</i>
                                    <span class="mdc-button__label">{{ $t('Abandon') }}</span>
                                </button>
                                <button v-if="isArchived" @click="$refs['remove-character'].open()" type="button"
                                        class="mdc-button mdc-button--raised" :disabled="appData.read_only">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                                    <span class="mdc-button__label">{{ $t('Remove') }}</span>
                                </button>
                                <button v-if="isArchived" type="button"
                                        @click="restore"
                                        :disabled="appData.read_only || characterRepository.partyHasCharacter(sheet, character.id)"
                                        class="ml-4 mdc-button mdc-button--raised">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon" aria-hidden="true">replay</i>
                                    <span class="mdc-button__label">{{ $t('Restore') }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="character && selected && abilities" class="w-full relative sm:ml-8">
                    <abilities :character="character" :sheet="sheet" @store="store"/>
                </div>
            </div>
        </div>

        <modal v-if="character" :title="$t('Retire') + ' ' + character.name"
               ref="retire-character">
            <template v-slot:content>
                <p v-if="isLocalCampaign">{{ $t('retire-character.upgrade') }}
                    <router-link to="/campaigns" class="link">
                        <span @click="$refs['retire-character'].close()">
                            {{ $t('Please consider purchasing a license') }}.
                        </span>
                    </router-link>
                </p>
                <p v-else>{{ $t('retire-character.text') }}</p>
                <p class="mt-2">{{ $t('retire-character.choice') }}</p>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label">{{ $t('Cancel') }}</span>
                </button>
                <button id="retire-character" type="button" class="mdc-button mdc-dialog__button"
                        data-mdc-dialog-action="yes" @click="retire">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label text-red-700">{{ $t('Retire') }}</span>
                </button>
            </template>
        </modal>
        <modal v-if="character" :title="$t('Abandon') + ' ' + character.name"
               ref="abandon-character">
            <template v-slot:content>
                <p v-if="isLocalCampaign">{{ $t('retire-character.upgrade') }}
                    <router-link to="/campaigns" class="link">
                        <span @click="$refs['abandon-character'].close()">
                            {{ $t('Please consider purchasing a license') }}.
                        </span>
                    </router-link>
                </p>
                <p v-else>{{ $t('abandon-character.text') }}</p>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label">{{ $t('Cancel') }}</span>
                </button>
                <button id="abandon-character" type="button" class="mdc-button mdc-dialog__button"
                        data-mdc-dialog-action="yes" @click="abandon">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label text-red-700">{{ $t('Abandon') }}</span>
                </button>
            </template>
        </modal>
        <modal v-if="character" :title="$t('Remove') + ' ' + character.name"
               ref="remove-character">
            <template v-slot:content>
                <p>{{ $t('remove-character.text') }}</p>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label">{{ $t('Cancel') }}</span>
                </button>
                <button type="button"  class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="remove">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label text-red-700">{{ $t('Remove') }}</span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetCalculations from "../services/SheetCalculations";
import SheetRepository from "../repositories/SheetRepository";
import Character from "../models/Character";
import CharacterRepository from "../repositories/CharacterRepository";
import {MDCTextField} from "@material/textfield/component";
import ItemRepository from "../repositories/ItemRepository";
import store from "store/dist/store.modern";
import ScenarioRepository from "../repositories/ScenarioRepository";
import BuildingRepository from "../repositories/BuildingRepository";
import ItemAvailability from "../services/ItemAvailability";
import Helpers from "../services/Helpers";
import TextField from "../components/elements/TextField.vue";
import {Game} from "../models/Game";

export default {
    components: {TextField},
    inject: ['appData'],
    mixins: [GetCampaignName, SheetCalculations],
    data() {
        return {
            sheet: null,
            sheetHash: null,
            selected: null,
            abilities: false,
            character: null,
            soloScenario: null,
            nameText: null,
            campaignName: null,
            loading: true,
            sheetItems: {},
            items: collect(),
            itemAvailability: null,
            outOfStockItems: [],
            isLocalCampaign: true,
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository,
            scenarioRepository: new ScenarioRepository,
            buildingRepository: new BuildingRepository,
            characterRepository: new CharacterRepository,
            itemRepository: new ItemRepository
        }
    },
    watch: {},
    mounted() {
        this.render();

        this.$bus.$on('campaigns-changed', this.render);
        this.$bus.$on('select-character', this.select);
    },
    unmounted() {
        this.$bus.$off('campaigns-changed', this.render);
        this.$bus.$off('select-character', this.select);
    },
    computed: {
        Game() {
            return Game
        },
        scenarioPerks() {
            return this.scenarioRepository.where((scenario) => scenario.isComplete())
                .sum('perk_reward');
        },
        isArchived() {
            // Reference sheet hash so the value is recalculated when the sheet is updated.
            this.sheetHash;
            return this.selected in this.sheet.archivedCharacters;
        },
        currentGame() {
            return this.sheet.game === Game.fc ? Game.gh : this.sheet.game;
        },
        playerIndex() {
            if (this.sheet.characters[this.character.uuid]) {
                return Object.keys(this.sheet.characters).indexOf(this.character.uuid);
            }
            if (this.sheet.archivedCharacters[this.character.uuid]) {
                return Object.keys(this.sheet.archivedCharacters).indexOf(this.character.uuid);
            }
            return 1;
        }
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = this.sheetRepository.make(this.appData.game);
            this.campaignName = this.getCampaignName();

            // Unregistered users can't archive characters
            // This may result in unstable storyline links
            this.isLocalCampaign = app.campaignId === 'local';

            this.selectDefault();

            await this.$nextTick();

            this.loading = false;
        },
        async refreshInputFields() {
            await this.$nextTick();

            this.$refs['name-field'].refresh();
        },
        findSoloScenario() {
            this.soloScenario = this.scenarioRepository.findSolo(this.character.id);
        },
        refreshItems() {
            if (this.character) {
                let sheetItems;
                this.sheetItems = {};

                // Get all manual unlocked items from the sheet, prefixed with the current game.
                const unlockedItems = this.unlockedItems(this.sheet.itemDesigns, this.currentGame);

                // Add auto unlocked items, based on prosperity level or completed scenarios.
                if (this.currentGame === Game.jotl) {
                    sheetItems = this.calculateItemsJotl(unlockedItems, this.scenarioRepository);
                }
                else if (this.currentGame === Game.fh) {
                    sheetItems = this.calculateItemsFh(unlockedItems, this.buildingRepository);
                }
                else if (this.currentGame === Game.gh2) {
                    sheetItems = this.calculateItemsGh2(unlockedItems, this.sheet.effectiveProsperityIndex);
                }
                else {
                    sheetItems = this.calculateItemsGh(unlockedItems, this.sheet.effectiveProsperityIndex);
                }

                // Find items from base game.
                let items = this.itemRepository.findMany(sheetItems);

                // Add items from other games, if enabled.
                if (this.sheet.crossGameItemsEnabled) {
                    const otherGames = collect(this.sheet.crossGameItems).filter().keys().all();
                    let otherGameHandler;

                    if (this.currentGame === Game.fh) {
                        otherGameHandler = (otherGame => {
                            const otherGameItems = collect(this.sheet.crossGameItems[otherGame]).filter().keys().all();
                            const otherItems = this.prependGame(otherGame, otherGameItems);
                            items = collect({...items.all(), ...this.itemRepository.findMany(otherItems).all()})
                        });
                    }
                    else {
                        otherGameHandler = (otherGame => {
                            if (otherGame !== this.currentGame) {
                                items = collect({...items.all(), ...this.itemRepository.fromGame(otherGame).all()});
                            }
                        });
                    }

                    otherGames.forEach(otherGameHandler);
                }

                this.items = items.all()

                Object.keys(this.items).forEach(id => {
                    this.sheetItems[id] = !!this.character.items[id];
                });

                this.refreshOutOfStockItems();
            }
        },
        refreshOutOfStockItems() {
            this.itemAvailability = new ItemAvailability(this.sheet);

            if (this.character) {
                this.outOfStockItems = [];

                for (const id in this.itemAvailability.itemCountUses) {
                    // The following items are out of stock
                    if (this.items[id] && this.itemAvailability.uses(id) >= this.items[id].count) {
                        this.outOfStockItems.push(id);
                    }
                }
            }
        },
        resetRollback() {
            this.$refs['level-rollback'].reset();
            this.$refs['xp-rollback'].reset();
            this.$refs['gold-rollback'].reset();
            this.$refs['resources']?.reset();
        },
        selectDefault() {
            // Opened from the Enhancer building: go straight to that character's abilities.
            const abilitiesUuid = this.$route.query.abilities;
            if (abilitiesUuid && this.sheet.characters[abilitiesUuid]) {
                this.select(abilitiesUuid, true);
                return;
            }

            const storedUuid = this.readSelected();
            if (storedUuid && (this.sheet.characters[storedUuid] || this.sheet.archivedCharacters[storedUuid])) {
                this.select(storedUuid);
            } else if (Object.keys(this.sheet.characters).length) {
                this.select(Object.keys(this.sheet.characters)[0]);
            } else if (Object.keys(this.sheet.archivedCharacters).length) {
                this.select(Object.keys(this.sheet.archivedCharacters)[0]);
            } else {
                this.selectDemo();
            }
        },
        selectAbilities(uuid, scrollToTop = false) {
            this.select(uuid, true);
            if (scrollToTop) {
                document.getElementById('characters').scrollIntoView();
            }
        },
        select(uuid, abilities = false) {
            if (this.sheet.characters[uuid]) {
                this.character = this.sheet.characters[uuid];
            } else if (this.sheet.archivedCharacters[uuid]) {
                this.character = this.sheet.archivedCharacters[uuid];
            }

            if (this.character) {
                this.nameText = this.character.name !== this.character.characterName
                    ? this.character.name
                    : this.$t(this.character.characterName);
                this.selected = uuid;
                this.abilities = false;

                // refresh abilities
                if (abilities) {
                    this.$nextTick(() => {
                        this.abilities = true;
                    });
                }
                // refresh character
                else {
                    this.findSoloScenario();
                    this.refreshItems();
                    this.rerender();
                    this.storeSelected();
                    this.$nextTick(() => {
                        this.resetRollback();
                        this.abilities = false;
                    });
                }
            }
        },
        selectDemo() {
            this.selected = null;
            this.character = Character.make('demo', this.appData.game, 'BR');
            this.nameText = this.$t(this.character.characterName);
            this.rerender();
        },
        create(id) {
            if (this.characterRepository.partyHasCharacter(this.sheet, id)) {
                return;
            }

            const wasLocked = !this.sheet.characterUnlocks[id];
            // Unlocking a class, or choosing a Crimson Scales starting class, adds its events.
            if (wasLocked || this.sheet.game === Game.cs) {
                this.sheet.addClassEvents(id, 'unlock');
            }
            if (wasLocked) {
                this.sheet.characterUnlocks[id] = true;
                this.sheet.store();
                this.scenarioRepository.scenarioValidator.validate();
            } else if (this.sheet.game === Game.cs) {
                this.sheet.store();
            }
            const character = this.characterRepository.createCharacter(this.sheet, id);
            this.select(character.uuid);
            this.store();
        },
        openItemModel(id) {
            this.$bus.$emit('open-item', {id: id});
        },
        storeItems() {
            this.character.items = this.sheetItems;
            this.store();
            this.refreshOutOfStockItems();
        },
        store() {
            if (this.loading || !this.selected) {
                return;
            }

            if (this.nameText !== this.character.name) {
                this.character.name = this.nameText;
            }
            this.character.store();
            this.storySyncer.store();
        },
        remove() {
            this.removeWith('removeCharacter');
        },
        retire() {
            this.removeWith('retireCharacter');
        },
        abandon() {
            this.removeWith('abandonCharacter');
        },
        restore() {
            if (this.character) {
                this.characterRepository.restoreCharacter(this.sheet, this.character);
                this.storySyncer.store();
                this.rerender();
            }
        },
        storeSelected() {
            store.set('selectedCharacter', this.selected);
        },
        readSelected() {
            return store.get('selectedCharacter');
        },
        itemFilterClosure(query) {
            // This allows to find items based on id or their name.
            return (id) => {
                const number = id.split('-').pop();
                return number.toLowerCase().startsWith(query)
                    || Helpers.sanitize(this.$t(this.items[id]?.name)).includes(query);
            }
        },
        renderHtml(html) {
            return {
                template: `<span>${html}</span>`
            };
        },
        rerender() {
            this.refreshInputFields();
            this.sheetHash = this.sheet.makeHash();
        },
        abilityBackImage() {
            return `/img/abilities/${this.character.game}/${this.character.id}/back.jpg`;
        },
        openCharacterMat() {
            this.$bus.$emit('open-character-mat', this.character);
        },
        removeWith(repositoryMethod) {
            if (!this.character) {
                return;
            }

            // Pro campaigns keep retired and abandoned characters archived, so they stay selected.
            const archive = !this.isLocalCampaign && repositoryMethod !== 'removeCharacter';
            this.characterRepository[repositoryMethod](this.sheet, this.character, archive);
            this.storySyncer.store();
            if (archive) {
                this.rerender();
            } else {
                this.selectDefault();
            }
        },
    }
}
</script>

<style scoped lang="scss">
// Two columns; the retirement section sits under the left column so long perk lists don't push it down.
// Stacked (mobile) it stays last.
@media (min-width: 872px) {
    .character-sheet {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;
        column-gap: 1rem;
    }

    .character-sheet-right {
        grid-column: 2;
        grid-row: 1 / span 2;
    }
}

#characters {
    // Keeps the art's negative z-index above the panel background.
    isolation: isolate;
}

.character-art {
    z-index: -1;
    opacity: .3;
    pointer-events: none;
    mask-image: radial-gradient(ellipse at top right, black 35%, transparent 75%);
    transition: opacity .3s;
}

.character-art-hover:hover ~ .character-art {
    opacity: .6;
}

// Mouse users click the art itself; touch devices and mobile (where the art isn't clickable) get a button.
.character-art-touch {
    display: none;

    @media (hover: none), (max-width: 639px) {
        display: block;
        animation: fade-in .5s ease-in;
    }
}

// Smaller icon, padding grown by the difference so the circle matches the add character button.
#character-art-button {
    font-size: 20px;
    padding: calc(.5rem + 2px);
}

@keyframes fade-in {
    from { opacity: 0; }
}
</style>
