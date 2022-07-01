<template>
    <div class="mb-4">

        <div class="sm:-mt-12 mb-2 flex justify-start sm:justify-end">

            <!-- Show all toggle -->
            <checkbox-with-label v-if="character.level < 9"
                                 class="ml-4"
                                 id="show-all-abilities"
                                 :label="$t('Show all')"
                                 :checked.sync="prefs.showAll"/>

            <!-- Sort dropdown -->
            <div class="mr-12 ml-auto sm:mr-0 sm:ml-4 mt-.5">
                <dropdown ref="ability-sort-dropdown" align="right">
                    <template v-slot:trigger>
                        <button class="mdc-button mdc-button--raised !bg-dark-gray2-75">
                            <i class="material-icons mdc-button__icon">sort</i>
                            <span class="flex w-full mdc-button__label">
                                {{ prefs.sortBy === 'initiative' ? $t('Initiative') : $t('Level') }}
                                <i class="ml-2 material-icons">
                                    {{ prefs.asc ? 'arrow_upward' : 'arrow_downward' }}
                                </i></span>
                        </button>
                    </template>

                    <ul class="mdc-list overflow-y-auto" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                        <template v-for="sort in sortByTypes">
                            <template v-for="direction in [true, false]">
                                <li class="mdc-list-item cursor-pointer"
                                    :class="{'mdc-list-item--activated': prefs.sortBy === sort && prefs.asc === direction}"
                                    @click="applySort(sort, direction)">
                                <span class="flex justify-between w-full mdc-list-item__text capitalize">
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
                <div class="flex items-center space-x-4 mb-2">
                    <h2>{{ prefs.showAll ? $t('All') : $t('Available') }}</h2>
                    <i class="material-icons mdc-button__icon hover:cursor-pointer"
                       @click="toggleStackedAvailable">
                        {{ prefs.stackedAvailable ? 'grid_view' : 'layers' }}
                    </i>
                    <i @click="toggleSide" class="hidden md:inline hover:cursor-pointer">
                        <inline-svg :src="prefs.deckSide ? 'icons/collapse' : 'icons/expand'"/>
                    </i>
                </div>

                <div class="grid gap-x-2"
                     :class="[
                         prefs.stackedAvailable ? 'gap-y-0': 'gap-y-2',
                         prefs.deckSide ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md2:grid-cols-3' : 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-1']">
                    <ability v-for="ability in sortedAbilities"
                             :key="'available-'+ability.code+'-'+abilityRenderKeys[ability.code]"
                             v-if="prefs.showAll || (character.level+.5) >= ability.level"
                             :ability="ability" :selected="character.abilities[ability.code]"
                             :active="(character.level+.5) >= ability.level"
                             :stacked="prefs.stackedAvailable" :animating="animatingAvailable"
                             group="available" @selected="selected" @click="openModel"/>
                </div>
            </div>

            <!-- Deck -->
            <div :class="[prefs.deckSide ? '' : 'md:col-span-2 lg:col-span-3']">
                <div class="deck-header flex items-center space-x-4 mb-2">
                    <h2>{{ $t('Deck') }} {{ abilityCount }} / {{ character.abilityCount }}</h2>
                    <i class="material-icons mdc-button__icon hover:cursor-pointer"
                       @click="toggleStackedDeck">
                        {{ prefs.stackedDeck ? 'grid_view' : 'layers' }}
                    </i>
                    <i @click="toggleSide" class="hidden md:inline hover:cursor-pointer">
                        <inline-svg :src="prefs.deckSide ? 'icons/expand' : 'icons/collapse'"/>
                    </i>
                </div>

                <div class="grid gap-x-2"
                     :class="[
                         prefs.stackedDeck ? 'gap-y-0': 'gap-y-2',
                         prefs.deckSide ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-1' : 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md2:grid-cols-3']">
                    <ability v-for="ability in sortedAbilities" :key="'deck-'+ability.code"
                             v-if="(character.level+.5) >= ability.level && character.abilities[ability.code]"
                             :ability="ability" :selected="true" :stacked="prefs.stackedDeck" :animating="animatingDeck"
                             group="deck" @selected="selected" @click="openModel"/>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Character from "../../../models/Character";
import AbilityRepository from "../../../repositories/AbilityRepository";
import {Flip} from "gsap/Flip.js";
import store from "store/dist/store.modern";

export default {
    props: {
        character: Character
    },
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
            abilityRepository: new AbilityRepository
        }
    },
    mounted() {
        this.abilities = collect(this.abilityRepository.abilities(this.character));

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
        sortedAbilities() {
            const sortBy = this.prefs.asc ? 'sortBy' : 'sortByDesc'
            return this.prefs.sortBy === 'initiative'
                ? this.abilities.sortBy('name')[sortBy]('initiative')
                : this.abilities.sortBy('name')[sortBy]('level');
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
                    Vue.set(this.character.abilities, code, true);
                    this.$emit('store');
                } else {
                    Vue.set(this.abilityRenderKeys, code, (this.abilityRenderKeys[code] || 0) + 1);
                    this.$bus.$emit('toast', this.$t('Deck is full'), false);
                }
            } else {
                Vue.delete(this.character.abilities, code);
                this.$emit('store');
            }
        },
        applySort(sort, direction) {
            this.prefs.sortBy = sort;
            this.prefs.asc = direction;
            this.$refs['ability-sort-dropdown'].close();
        },
        toggleSide() {
            this.animatingDeck = true;
            this.animatingAvailable = true;
            this.animate(() => {
                this.prefs.deckSide = !this.prefs.deckSide;
                if (this.prefs.deckSide) {
                    this.prefs.stackedDeck = true;
                    this.prefs.stackedAvailable = false;
                } else {
                    this.prefs.stackedDeck = false;
                    this.prefs.stackedAvailable = true;
                }
            });
        },
        toggleStackedAvailable() {
            this.animatingAvailable = true;
            this.animate(() => {
                this.prefs.stackedAvailable = !this.prefs.stackedAvailable
            }, '.available.ability-card');
        },
        toggleStackedDeck() {
            this.animatingDeck = true;
            this.animate(() => {
                this.prefs.stackedDeck = !this.prefs.stackedDeck
            }, '.deck.ability-card');
        },
        async animate(closure, selector = '.deck-header, .ability-card') {
            let state = Flip.getState(selector);
            closure();
            await this.$nextTick();
            Flip.from(state, {
                duration: 1,
                ease: "power1.inOut",
                absolute: true,
                simple: true,
                onComplete: () => {
                    this.animatingDeck = false;
                    this.animatingAvailable = false;
                }
            });
        },
        openModel(group, ability) {
            this.$bus.$emit('open-ability-card', ability);
        }
    }
}
</script>

<style lang="scss">

</style>
