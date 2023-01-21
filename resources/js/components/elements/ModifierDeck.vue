<template>
    <div class="mb-4">
        <a id="open-modifier-deck" class="cursor-pointer" @click="open">
            <card-stack :src="backImage"/>
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
                    perkDescription.cards?.forEach((card, index) => {
                        // Add cards to the deck
                        if (perkDescription.type === 'add') {
                            this.addCard(deck, card);
                        }
                        // Remove cards from the deck
                        else if (perkDescription.type === 'remove') {
                            this.removeCard(deck, card);
                        }
                        // Replace cards in the deck
                        else if (perkDescription.type === 'replace') {
                            if (index === 0) {
                                this.removeCard(deck, card);
                            } else {
                                this.addCard(deck, card);
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
        },
        addCard(deck, card) {
            deck[card.code] = (deck[card.code] || 0) + (card.count || 1);
        },
        removeCard(deck, card) {
            deck[card.code] = (deck[card.code] || 0) - (card.count || 1);
            if (deck[card.code] <= 0) {
                delete deck[card.code];
            }
        }
    }
}
</script>
