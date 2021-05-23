<template>
    <div>
        <modal ref="modal" :title="card ? card.title : ''" :max-width="'348px'"
               :overflowHidden="animating">
            <div v-if="card" slot="content" class="w-full h-full flex outline-none">
                <div class="relative w-full" style="max-width: 300px;">
                    <flip-card :flipped="!!choice">
                        <template v-slot:front>
                            <webp :src="card.images[0]" :alt="card.title"
                                  class="w-full rounded-lg sm:rounded-xl"/>
                        </template>
                        <template v-slot:back>
                            <webp :src="card.images[1]" :alt="card.title"
                                  class="w-full rounded-lg sm:rounded-xl"/>
                        </template>
                    </flip-card>

                    <!-- push buttons under the flip card wit the same aspect ratio -->
                    <webp :src="card.images[0]" class="invisible"></webp>

                    <div v-if="blur"
                         class="blur rounded-lg absolute h-1/2 w-full top-0 left-0"
                         :class="{'top-1/2': choice === 'A'}">
                    </div>

                    <div v-if="!choice" class="mt-4 flex justify-between">
                        <button @click="chose('A')"
                                class="mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__label">A</span>
                        </button>
                        <button @click="chose('B')"
                                class="mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__label">B</span>
                        </button>
                    </div>
                    <div v-if="choice" class="mt-4 flex justify-center">
                        <button @click="blur = !blur"
                                class="mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__label">
                                {{ $t('Toggle') + ' ' + (choice === 'A' ? 'B' : 'A') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

import Card from "../../models/Card";
import FlipCard from "../elements/FlipCard";

export default {
    components: {FlipCard},
    data() {
        return {
            card: null,
            choice: null,
            animating: false,
            blur: false
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
            this.animating = false;
            this.blur = false;
            this.$refs['modal'].open();
        },
        chose(choice) {
            this.choice = choice;
            this.animating = true;

            // half way animating
            setTimeout(() => {
                this.blur = true;
            }, 200);

            // animation done
            setTimeout(() => {
                this.animating = false;
            }, 600);
        },
        close() {
            this.card = null;
            this.$refs['modal'].close();
        }
    }
}
</script>
<style scoped lang="scss">
.blur {
    backdrop-filter: blur(4px);
}
</style>
