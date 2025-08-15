<template>
    <modifier-deck v-if="character"
                   :perks="perks"
                   :perk-descriptions="perkDescriptions"
                   :available-cards="availableCards"
                   :default-deck="defaultDeck"
                   :back-image="backImage"
                   :title="$t('Attack Modifier Deck')"/>
</template>

<script>

import Character from "../../../models/Character";
import AttackModifierRepository from "../../../repositories/AttackModifierRepository";

export default {
    props: {
        character: Character,
        perkDescriptions: Array,
        perks: Object,
        playerIndex: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            backImage: '/img/attack-modifiers/base/back.jpg',
            defaultDeck: {
                "plus0": 6,
                "plus1": 5,
                "plus2": 1,
                "minus1": 5,
                "minus2": 1,
                "times2": 1,
                "mis": 1,
            },
            modifierRepository: new AttackModifierRepository
        }
    },
    mounted() {

    },
    computed: {
        playerNumber() {
            return this.playerIndex % 4 + 1
        },
        availableCards() {
            return this.modifierRepository.get(this.character, this.playerNumber)
        }
    },
    methods: {

    }
}
</script>
