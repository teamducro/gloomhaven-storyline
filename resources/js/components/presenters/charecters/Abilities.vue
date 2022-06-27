<template>
    <div class="mb-4">

        <div class="sm:-mt-12 mb-2 flex justify-start sm:justify-end">
            <checkbox-with-label
                id="stacked-abilities"
                :checked.sync="stacked"
            >
                <label for="stacked-abilities">
                    <i class="material-icons mdc-button__icon">layers</i>
                </label>
            </checkbox-with-label>
            <checkbox-with-label v-if="character.level < 9"
                                 class="ml-4"
                                 id="show-all-abilities"
                                 :label="$t('Show all')"
                                 :checked.sync="showAll"/>
            <div class="mr-12 ml-auto sm:mr-0 sm:ml-4 mt-.5">
                <dropdown ref="ability-sort-dropdown" align="right">
                    <template v-slot:trigger>
                        <button class="mdc-button mdc-button--raised !bg-dark-gray2-75">
                            <i class="material-icons mdc-button__icon">sort</i>
                            <span class="flex w-full mdc-button__label">
                                {{ sortByInitiative ? $t('Initiative') : $t('Level') }}
                                <i class="ml-2 material-icons">
                                    {{ asc ? 'arrow_upward' : 'arrow_downward' }}
                                </i></span>
                        </button>
                    </template>

                    <ul class="mdc-list overflow-y-auto" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                        <li class="mdc-list-item cursor-pointer"
                            :class="{'mdc-list-item--activated': !sortByInitiative && asc}"
                            @click="sortByInitiative = false; asc = true; $refs['ability-sort-dropdown'].close();">
                            <span class="flex justify-between w-full mdc-list-item__text">{{ $t('Level') }}
                                <i class="ml-2 material-icons">arrow_upward</i></span>
                        </li>
                        <li class="mdc-list-item cursor-pointer"
                            :class="{'mdc-list-item--activated': !sortByInitiative && !asc}"
                            @click="sortByInitiative = false; asc = false; $refs['ability-sort-dropdown'].close();">
                            <span class="flex justify-between w-full mdc-list-item__text">{{ $t('Level') }}
                                <i class="ml-2 material-icons">arrow_downward</i></span>
                        </li>
                        <li class="mdc-list-item cursor-pointer"
                            :class="{'mdc-list-item--activated': sortByInitiative && asc}"
                            @click="sortByInitiative = true; asc = true; $refs['ability-sort-dropdown'].close();">
                            <span class="flex justify-between w-full mdc-list-item__text">{{ $t('Initiative') }}
                                <i class="ml-2 material-icons">arrow_upward</i></span>
                        </li>
                        <li class="mdc-list-item cursor-pointer"
                            :class="{'mdc-list-item--activated': sortByInitiative && !asc}"
                            @click="sortByInitiative = true; asc = false; $refs['ability-sort-dropdown'].close();">
                            <span class="flex justify-between w-full mdc-list-item__text">{{ $t('Initiative') }}
                                <i class="ml-2 material-icons">arrow_downward</i></span>
                        </li>
                    </ul>
                </dropdown>
            </div>
        </div>

        <div class="mb-2 flex flex-col sm:flex-row-reverse">
            <div class="min-w-44">
                <h2>{{ $t('Deck') }} {{ abilityCount }} / {{ character.abilityCount }}</h2>
                <div class="flex flex-wrap sm:flex-nowrap sm:flex-col mb-56">
                    <ability v-for="ability in sortedAbilities" :key="'deck-'+ability.code"
                             v-if="(character.level+.5) >= ability.level && character.abilities[ability.code]"
                             :ability="ability" :selected="true" :stacked="true"
                             group="deck" @selected="selected" @click="openModel"/>
                </div>
            </div>
            <div class="flex-1">
                <h2>{{ showAll ? $t('All') : $t('Available') }} {{ $t('Abilities').toLowerCase() }}</h2>
                <div class="flex flex-wrap">
                    <ability v-for="ability in sortedAbilities"
                             :key="'available-'+ability.code+'-'+abilityRenderKeys[ability.code]"
                             v-if="showAll || (character.level+.5) >= ability.level"
                             :ability="ability" :selected="character.abilities[ability.code]"
                             :stacked="stacked"
                             group="available" @selected="selected" @click="openModel"/>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Character from "../../../models/Character";
import AbilityRepository from "../../../repositories/AbilityRepository";
import md5 from "js-md5";

export default {
    props: {
        character: Character
    },
    data() {
        return {
            showAll: false,
            sortByInitiative: false,
            asc: true,
            stacked: false,
            abilities: collect([]),
            abilityRenderKeys: {},
            abilityRepository: new AbilityRepository
        }
    },
    mounted() {
        this.abilities = collect(this.abilityRepository.abilities(this.character));
    },
    computed: {
        sortedAbilities() {
            const sortBy = this.asc ? 'sortBy' : 'sortByDesc'
            return this.sortByInitiative
                ? this.abilities.sortBy('name')[sortBy]('initiative')
                : this.abilities.sortBy('name')[sortBy]('level');
        },
        abilityCount() {
            return Object.keys(this.character.abilities).length;
        }
    },
    methods: {
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
        openModel(group, code) {

        }
    }
}
</script>

<style lang="scss">

</style>
