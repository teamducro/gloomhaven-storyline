<template>
    <div>
        <modal ref="modal" title="Attack modifier deck">
            <div v-if="deck" slot="content" class="w-full h-full flex flex-col outline-none">
                <ul>
                    <li v-for="(card, i) in deck">
                        <add-links-and-icons :text="card.icon"/>
                        <span class="pl-2 font-bold">{{ card.count }}</span>
                    </li>
                </ul>
            </div>
        </modal>
    </div>
</template>

<script>

import AddLinksAndIcons from "../elements/AddLinksAndIcons.vue";

export default {
    components: {AddLinksAndIcons},
    data() {
        return {
            deck: null
        }
    },
    mounted() {
        this.$bus.$on('open-modifier-deck', (deck) => {
            this.open(deck);
        });
        this.$bus.$on('close-modifier-deck', this.close);
    },
    methods: {
        async open(deck) {
            console.log(deck);
            this.deck = deck;
            this.$refs['modal'].open();
        },
        close() {
            this.deck = null;
            this.$refs['modal'].close();
        }
    }
}
</script>
