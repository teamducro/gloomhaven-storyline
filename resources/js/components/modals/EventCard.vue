<template>
    <div>
        <modal ref="modal" :title="card ? card.title : ''" :max-width="'348px'">
            <div v-if="card" slot="content" class="w-full h-full flex outline-none">
                <div class="relative" style="max-width: 300px;">
                    <webp :src="choice ? card.images[1] : card.images[0]" :alt="card.title"
                          class="w-full rounded-lg sm:rounded-xl"/>

                    <div v-if="choice"
                         class="blur absolute h-1/2 w-full top-0 left-0"
                         :class="{'top-1/2': choice === 'A'}">
                    </div>

                    <div v-if="!choice" class="mt-4 flex justify-between">
                        <button @click="chose('A')"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__label">A</span>
                        </button>
                        <button @click="chose('B')"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__label">B</span>
                        </button>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

import Card from "../../models/Card";

export default {
    data() {
        return {
            card: null,
            choice: null
        }
    },
    mounted() {
        this.$bus.$on('open-card', (card) => {
            this.open(new Card(card));
        });
        this.$bus.$on('close-card', () => {
            this.close();
        });
    },
    methods: {
        open(card) {
            this.card = card;
            this.choice = null;
            this.$refs['modal'].open();
        },
        chose(choice) {
            this.choice = choice;
        },
        close() {
            this.card = null;
            this.$refs['modal'].close();
        }
    }
}
</script>
<style lang="scss">
.blur {
    backdrop-filter: blur(4px);
}
</style>
