<template>
    <div class="mb-4">

        <div class="mb-2 flex items-center">
            <div class="flex flex-col">
                <span v-for="ability in abilities">{{ ability._name }}</span>
            </div>
        </div>

    </div>
</template>

<script>
import Character from "../../../models/Character";
import AbilityRepository from "../../../repositories/AbilityRepository";

export default {
    props: {
        character: Character
    },
    data() {
        return {
            abilities: [],
            abilityRepository: new AbilityRepository
        }
    },
    mounted() {
        this.abilities = this.abilityRepository.abilities(this.character);
    },
    computed: {},
    methods: {}
}
</script>

<style lang="scss">

</style>
