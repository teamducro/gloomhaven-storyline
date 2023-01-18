<template>
    <modifier-deck v-if="character"
                   :perks="perks"
                   :perk-descriptions="perkDescriptions"
                   :available-cards="availableCards"
                   :default-deck="defaultDeck"
                   :back-image="backImage"/>
</template>

<script>

import Character from "../../../models/Character";
import AttackModifierRepository from "../../../repositories/AttackModifierRepository";

export default {
    props: {
        character: Character,
        perkDescriptions: Array,
        perks: Object
    },
    data() {
        return {
            backImage: '/img/attack-modifiers/base/back.jpg',
            defaultDeck: {
                "+0": 6,
                "+1": 5,
                "+2": 1,
                "-1": 5,
                "-2": 1,
                "x2": 1,
                "mis": 1,
            },
            modifierRepository: new AttackModifierRepository
        }
    },
    mounted() {

    },
    computed: {
        availableCards() {
            return this.modifierRepository.get(this.character)
        }
    },
    methods: {

    }
}
</script>
