<template>
    <div>
        <modal ref="modal" title="Attack modifier deck">
            <div v-if="deck" slot="content" class="w-full h-full flex flex-col outline-none">
                <ul class="grid grid-cols-2 xs:grid-cols-3 gap-4 mt-2">
                    <li v-for="(card, i) in deck" class="relative">
                        <card-stack :src="card.image" :count="card.count"/>
                        <span class="absolute z-1 bg-dark-gray2-75 bottom-0 left-0 pl-1 pt-2 pr-2 rounded-tr-full font-title text-xl text-white">
                            {{ card.count }}x
                        </span>
                    </li>
                </ul>
            </div>
        </modal>
    </div>
</template>

<script>

export default {
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
