<template>
    <div class="mb-4">

        <div class="md2:-mt-12 mb-2 flex flex-row justify-end">

            <!-- Enhancements toggle -->
            <checkbox-with-label id="desktop-enable-enhancements"
                                 class="hidden md:flex" :label="$t('Enhancements')"
                                 v-model:checked="sheet.enhancementsEnabled"
                                 @change="storeSheet"/>

            <!-- Milestone toggle -->
            <checkbox-with-label v-if="isCs" id="desktop-milestone-achieved"
                                 class="hidden md:flex" :label="$t('Milestone achieved')"
                                 v-model:checked="character.milestone"
                                 :disabled="appData.read_only"
                                 @change="toggleMilestone"/>

            <!-- Show all toggle -->
            <checkbox-with-label id="desktop-show-all-abilities" class="hidden md:flex"
                                 :label="$t('Show all')" :auto-disable="false"
                                 v-model:checked="prefs.showAll"/>

            <!-- Manage -->
            <button @click="manageAvailable" id="open-manage-abilities" :disabled="appData.read_only"
                    class="mdc-button mdc-button--raised bg-dark-gray2-75! mt-0.5 ml-2 sm:ml-4">
                <span class="mdc-button__ripple"></span>
                <inline-svg src="icons/level" class="mdc-button__icon flex! flex-col transition-colors"
                            :class="[hasAvailableSlots ? 'animate-color-'+character.id.toLowerCase() : '']"
                            classes="w-full"/>
                <span class="mdc-button__label">{{ $t('Manage') }}</span>
            </button>

            <!-- Sort dropdown -->
            <div class="mr-12 sm:mr-0 ml-2 sm:ml-4 mt-0.5">
                <dropdown ref="ability-sort-dropdown" id="ability-sort-dropdown" align="right">
                    <template v-slot:trigger>
                        <button class="mdc-button mdc-button--raised bg-dark-gray2-75!">
                            <span class="mdc-button__ripple"></span>
                            <i class="material-icons mdc-button__icon">sort</i>
                            <span class="flex w-full mdc-button__label">
                                {{ prefs.sortBy === 'initiative' ? $t('Initiative') : $t('Level') }}
                                <i class="ml-2 material-icons">
                                    {{ prefs.asc ? 'arrow_upward' : 'arrow_downward' }}
                                </i></span>
                        </button>
                    </template>

                    <ul class="mdc-deprecated-list overflow-y-auto" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                        <template v-for="sort in sortByTypes">
                            <template v-for="direction in [true, false]">
                                <li class="mdc-deprecated-list-item cursor-pointer"
                                    :class="{'mdc-deprecated-list-item--activated': prefs.sortBy === sort && prefs.asc === direction}"
                                    @click="applySort(sort, direction)">
                                <span class="mdc-deprecated-list-item__ripple"></span>
                                <span class="flex justify-between w-full mdc-deprecated-list-item__text capitalize">
                                    {{ $t(sort) }}
                                    <i class="ml-2 material-icons"
                                       v-text="direction ? 'arrow_upward' : 'arrow_downward'"/>
                                </span>
                                </li>
                            </template>
                        </template>
                    </ul>
                </dropdown>
            </div>

        </div>

        <div class="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">

            <!-- Available abilities -->
            <div class="order-1 md:order-0"
                 :class="[prefs.deckSide ? 'md:col-span-2 lg:col-span-3' : '']">
                <div class="available-header flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                    <h2>{{ prefs.showAll ? $t('All') : $t('Available') }}</h2>
                    <i class="material-icons mdc-button__icon hover:cursor-pointer"
                       @click="toggleStackedAvailable">
                        {{ prefs.stackedAvailable ? 'grid_view' : 'content_copy' }}
                    </i>
                    <i @click="toggleSide" class="side-toggle hidden md:inline hover:cursor-pointer">
                        <inline-svg :src="prefs.deckSide ? 'icons/collapse' : 'icons/expand'"/>
                    </i>
                    <!-- Show all toggle -->
                    <checkbox-with-label id="mobile-show-all-abilities" class="md:hidden"
                                         :label="$t('Show all')" :auto-disable="false"
                                         v-model:checked="prefs.showAll"/>
                    <!-- Milestone toggle -->
                    <checkbox-with-label v-if="isCs" id="mobile-milestone-achieved" class="md:hidden"
                                         :label="$t('Milestone achieved')"
                                         v-model:checked="character.milestone"
                                         :disabled="appData.read_only"
                                         @change="toggleMilestone"/>
                    <!-- Enhancements toggle -->
                    <checkbox-with-label id="mobile-enable-enhancements" class="md:hidden"
                                         :label="$t('Enhancements')"
                                         v-model:checked="sheet.enhancementsEnabled"
                                         @change="storeSheet"/>
                </div>

                <div class="grid gap-x-2"
                     :class="[
                         prefs.stackedAvailable ? 'gap-y-0': 'gap-y-2',
                         prefs.deckSide ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md2:grid-cols-3' : 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-1']">
                    <template v-for="ability in sortedAbilities" :key="'available-'+ability.code+'-'+abilityRenderKeys[ability.code]">
                        <ability v-if="prefs.showAll || (character.level+.5) >= ability.level"
                                 :ability="ability" :selected="character.abilities[ability.code]"
                                 :active="(character.level+.5) >= ability.level"
                                 :stacked="prefs.stackedAvailable" :animating="animatingAvailable"
                                 :enhancements="characterEnhancements[ability.code] || []"
                                 group="available" @selected="selected" @click="openModel"/>
                    </template>
                </div>
            </div>

            <!-- Deck -->
            <div :class="[prefs.deckSide ? '' : 'md:col-span-2 lg:col-span-3']">
                <div class="deck-header flex items-center space-x-4 mb-2">
                    <h2>{{ $t('Deck') }} {{ abilityCount }} / {{ character.abilityCount }}</h2>
                    <i class="material-icons mdc-button__icon hover:cursor-pointer"
                       @click="toggleStackedDeck">
                        {{ prefs.stackedDeck ? 'grid_view' : 'content_copy' }}
                    </i>
                    <i @click="toggleSide" class="side-toggle hidden md:inline hover:cursor-pointer">
                        <inline-svg :src="prefs.deckSide ? 'icons/expand' : 'icons/collapse'"/>
                    </i>
                </div>

                <div class="grid gap-x-2"
                     :class="[
                         prefs.stackedDeck ? 'gap-y-0': 'gap-y-2',
                         prefs.deckSide ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-1' : 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md2:grid-cols-3']">
                    <template v-for="ability in sortedAbilities" :key="'deck-'+ability.code">
                        <ability v-if="(character.level+.5) >= ability.level && character.abilities[ability.code]"
                                 :ability="ability" :selected="true" :stacked="prefs.stackedDeck" :animating="animatingDeck"
                                 :enhancements="characterEnhancements[ability.code] || []"
                                 group="deck" @selected="selected" @click="openModel"/>
                    </template>
                </div>
            </div>
        </div>

        <manage-abilities :sheet="sheet" @store="store"></manage-abilities>
    </div>
</template>

<script>
import Character from "../../../models/Character";
import AbilityRepository from "../../../repositories/AbilityRepository";
import StorySyncer from "../../../services/StorySyncer";
import store from "store/dist/store.modern";
import Flip from "../../../mixins/Flip";

export default {
    emits: ['store'],
    inject: ['appData'],
    props: {
        character: Character,
        // Shared with the parent page so every save writes the same, up-to-date sheet.
        sheet: Object,
    },
    mixins: [Flip],
    data() {
        return {
            prefs: {
                showAll: false,
                sortBy: 'level',
                asc: true,
                deckSide: true,
                stackedDeck: true,
                stackedAvailable: false,
            },
            animatingDeck: false,
            animatingAvailable: false,
            sortByTypes: ['level', 'initiative'],
            abilities: collect([]),
            abilityRenderKeys: {},
            abilityRepository: new AbilityRepository,
            storySyncer: new StorySyncer,
        }
    },
    mounted() {
        this.abilities = collect(this.abilityRepository.abilities(this.character));
        // Characters saved before the flag existed keep the milestone card they already picked.
        if (this.abilities.contains(ability => ability.milestone && this.character.abilities[ability.code])) {
            this.character.milestone = true;
        }

        this.prefs = this.readPrefs() ?? this.prefs;
    },
    watch: {
        prefs: {
            handler(prefs) {
                this.storePrefs();
            },
            deep: true
        }
    },
    computed: {
        characterEnhancements() {
            if (!this.sheet.enhancementsEnabled) {
                return {};
            }

            return this.sheet.enhancements[this.character.id] || {};
        },
        sortedAbilities() {
            const sortBy = this.prefs.asc ? 'sortBy' : 'sortByDesc'
            return this.prefs.sortBy === 'initiative'
                ? this.filteredAbilities.sortBy('name')[sortBy]('initiative')
                : this.filteredAbilities.sortBy('name')[sortBy]('level');
        },
        hasAvailableSlots() {
            return this.availableSlots.isNotEmpty();
        },
        availableSlots() {
            return collect(this.character.abilityPerLevel).filter((abilityCode, level) => {
                return level <= this.character.level && abilityCode === null;
            });
        },
        selectedAbilities() {
            return Object.values(this.character.abilityPerLevel).filter(a => a);
        },
        isCs() {
            return this.character.game === 'cs';
        },
        filteredAbilities() {
            const abilities = this.abilities.filter(ability => !ability.milestone || this.character.milestone);

            if (!this.prefs.showAll && this.selectedAbilities.length) {
                return abilities.filter((ability) => {
                    return ability.level < 2 || this.selectedAbilities.includes(ability.code);
                });
            } else {
                return abilities;
            }
        },
        abilityCount() {
            return Object.keys(this.character.abilities).length;
        }
    },
    methods: {
        readPrefs() {
            return store.get('ability-prefs');
        },
        storePrefs() {
            store.set('ability-prefs', this.prefs);
        },
        async selected(code, checked) {
            if (checked) {
                if (this.abilityCount < this.character.abilityCount) {
                    this.character.abilities[code] = true;
                    this.store();
                } else {
                    this.abilityRenderKeys[code] = (this.abilityRenderKeys[code] || 0) + 1;
                    this.$bus.$emit('toast', this.$t('Deck is full'), false);
                }
            } else {
                delete this.character.abilities[code];
                this.store();
            }
        },
        applySort(sort, direction) {
            this.prefs.sortBy = sort;
            this.prefs.asc = direction;
            this.$refs['ability-sort-dropdown'].close();
        },
        async toggleSide() {
            this.animatingDeck = true;
            this.animatingAvailable = true;

            await this.animate('.deck-header, .ability-card', () => {
                this.prefs.deckSide = !this.prefs.deckSide;
                if (this.prefs.deckSide) {
                    this.prefs.stackedDeck = true;
                    this.prefs.stackedAvailable = false;
                } else {
                    this.prefs.stackedDeck = false;
                    this.prefs.stackedAvailable = true;
                }
            });

            this.animatingDeck = false;
            this.animatingAvailable = false;
        },
        async toggleStackedAvailable() {
            this.animatingAvailable = true;

            await this.animate('.available.ability-card', () => {
                this.prefs.stackedAvailable = !this.prefs.stackedAvailable
            });

            this.animatingAvailable = false;
        },
        async toggleStackedDeck() {
            this.animatingDeck = true;

            await this.animate('.deck.ability-card', () => {
                this.prefs.stackedDeck = !this.prefs.stackedDeck
            });

            this.animatingDeck = false;
        },
        manageAvailable() {
            this.$bus.$emit('open-manage-abilities', this.character);
        },
        openModel(group, ability) {
            this.$bus.$emit('open-ability-card', {ability, character: this.character, sheet: this.sheet});
        },
        toggleMilestone() {
            if (!this.character.milestone) {
                // A hidden card must not keep taking up a deck slot.
                this.abilities.filter(ability => ability.milestone)
                    .each(ability => delete this.character.abilities[ability.code]);
            }
            this.store();
        },
        storeSheet() {
            this.sheet.store();
            this.storySyncer.store();
        },
        store() {
            this.$emit('store');
        }
    }
}
</script>

<style lang="scss">

</style>
