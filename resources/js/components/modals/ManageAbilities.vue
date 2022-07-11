<template>
    <div>
        <modal ref="modal">
            <template v-slot:title>
                <span class="capitalize">{{ $t('manage-abilities.title') }}</span>
            </template>
            <div v-if="abilities.isNotEmpty()" slot="content" class="w-full">
                <p v-if="character.level === 1">
                    {{ $t('manage-abilities.level_1', {character: character.name}) }}
                </p>
                <p v-else>{{ $t('manage-abilities.text') }}</p>

                <div class="grid gap-2 grid-cols-2 xs:grid-cols-3 my-4">
                    <div v-for="level in character.level" v-if="level > 1">
                        <h3 class="text-white text-xl text-center">{{ level }}</h3>
                        <div v-if="!character.abilityPerLevel[level]"
                             :class="'w-full h-9 border-dashed rounded border border-character-'+character.id.toLowerCase()">

                        </div>
                        <ability v-else :key="'selected-available-'+character.abilityPerLevel[level]"
                                 :ability="abilities.firstWhere('code', character.abilityPerLevel[level])"
                                 :selected="true" :active="true" :stacked="true"
                                 group="selected-available" @selected="selected" @click="openModel"/>
                    </div>
                </div>

                <div class="relative">
                    <div class="inset-0 flex items-center" aria-hidden="true">
                        <div class="w-full border-t border-white2-25"/>
                    </div>
                </div>

                <div class="my-4 grid gap-2 grid-cols-2 xs:grid-cols-3">
                    <ability v-for="ability in abilities" :key="'manage-available-'+ability.code"
                             :class="['transition-opacity', isActive(ability) ? 'opacity-100' : 'opacity-50']"
                             :ability="ability" :selected="selectedAbilities.includes(ability.code)"
                             :active="isActive(ability)" :stacked="false"
                             group="manage-available" @selected="selected" @click="openModel"/>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

import AbilityRepository from "../../repositories/AbilityRepository";

export default {
    data() {
        return {
            character: null,
            abilities: collect([]),
            abilityRepository: new AbilityRepository
        }
    },
    mounted() {
        this.$bus.$on('open-manage-abilities', (character) => {
            this.open(character);
        });
        this.$bus.$on('close-manage-abilities', this.close);
    },
    computed: {
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
    },
    methods: {
        async open(character) {
            this.character = character;
            this.abilities = collect(this.abilityRepository.abilities(this.character))
                .filter(ability => ability.level >= 2 && ability.level <= this.character.level)
                .sortBy('name').sortBy('level');

            this.$refs['modal'].open();
        },
        close() {
            this.character = null;
            this.abilities = collect([]);
            this.$refs['modal'].close();
        },
        getSelectedLevel(abilityCode) {
            return Object.keys(this.character.abilityPerLevel)
                .find(slotLevel => this.character.abilityPerLevel[slotLevel] === abilityCode)
        },
        isActive(ability) {
            const highestAvailableLevel = this.availableSlots.keys().last()
            return (highestAvailableLevel >= ability.level) || this.getSelectedLevel(ability.code) > 1
        },
        async selected(code, checked) {
            if (checked) {
                const ability = this.abilities.firstWhere('code', code);

                const slotLevel = Object.keys(this.character.abilityPerLevel)
                    .find(slotLevel => slotLevel >= ability.level && this.character.abilityPerLevel[slotLevel] === null);

                if (slotLevel) {
                    Vue.set(this.character.abilityPerLevel, slotLevel, code);
                    this.store();
                }
            } else {
                const slotLevel = this.getSelectedLevel(code);

                if (slotLevel) {
                    Vue.set(this.character.abilityPerLevel, slotLevel, null);
                    this.store();
                }
            }
        },
        store() {
            this.$emit('store');
        },
        openModel(group, ability) {
            this.$bus.$emit('open-ability-card', ability);
        }
    }
}
</script>
