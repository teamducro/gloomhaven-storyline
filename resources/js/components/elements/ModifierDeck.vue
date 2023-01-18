<template>
    <div class="mb-4">
        <a class="cursor-pointer inline-block relative" @click="open">
            <webp :src="backImage" class="w-32 z-1 relative"/>
            <webp :src="backImage" class="w-32 absolute z-0 top-0 left-0" style="transform: rotate(-5deg);"/>
            <webp :src="backImage" class="w-32 absolute z-0 top-0 left-0" style="transform: rotate(-2deg);"/>
            <webp :src="backImage" class="w-32 absolute z-0 top-0 left-0" style="transform: rotate(2deg);"/>
            <webp :src="backImage" class="w-32 absolute z-0 top-0 left-0" style="transform: rotate(5deg);"/>
        </a>
    </div>
</template>

<script>

import {Collection} from "collect.js";

export default {
    props: {
        perks: Object,
        perkDescriptions: Array,
        backImage: String,
        defaultDeck: Object,
        availableCards: Collection
    },
    data() {
        return {}
    },
    mounted() {

    },
    computed: {
        deck() {
            // Add the default cards to the deck
            let deck = {...this.defaultDeck};

            // Add/Remove the perk cards to the deck
            for (const [index, perkDescription] of this.perkDescriptions.entries()) {
                this.perks[index].forEach((checked) => {
                    // Ignore it if it's not checked
                    if (!checked) {
                        return;
                    }

                    // If the perk is checked, apply the modifiers
                    perkDescription.modifiers?.forEach((modifier) => {
                        // Add cards to the deck
                        if (modifier.type === 'add') {
                            deck[modifier.card] = (deck[modifier.card] || 0) + (modifier.count || 1);
                        }
                        // Remove cards from the deck
                        else {
                            deck[modifier.card] = (deck[modifier.card] || 0) - (modifier.count || 1);
                            if (deck[modifier.card] <= 0) {
                                delete deck[modifier.card];
                            }
                        }
                    });
                });
            }

            let result = [];

            // Convert the strings to cards so the modal can show the cards as images
            for (const [code, count] of Object.entries(deck)) {
                const card = this.availableCards.get(code);
                card.count = count
                result.push(card)
            }

            return result
        }
    },
    methods: {
        open() {
            this.$bus.$emit('open-modifier-deck', this.deck);
        }
    }
}
</script>
