<template>
    <modifier-deck :perks="perks"
                   :perk-descriptions="perkDescriptions"
                   :available-cards="availableCards"
                   :default-deck="defaultDeck"
                   :back-image="backImage"/>
</template>

<script>

import AttackModifierRepository from "../../../repositories/AttackModifierRepository";

export default {
    props: {
        perkDescriptions: Array,
        perks: Object,
    },
    data() {
        return {
            backImage: '/img/attack-modifiers/town-guard/back.jpg',
            defaultDeck: {
                "plus0": 6,
                "minus10": 5,
                "minus20": 1,
                "plus10": 5,
                "plus20": 1,
                "wreck": 1,
                "success": 1,
            },
            modifierRepository: new AttackModifierRepository
        }
    },
    mounted() {

    },
    computed: {
        availableCards() {
            return this.modifierRepository.getTownGuardModifiers()
        }
    },
    methods: {

    }
}
</script>
