<template>
    <div>
        <modal ref="modal" :title="card ? card.title : ''" :max-width="'348px'"
               :overflowHidden="animating">
            <div v-if="card" slot="content" class="w-full h-full flex flex-col outline-none">
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

                    <transition name="fade">
                        <div v-if="blur"
                             class="blur rounded-lg absolute h-1/2 w-full top-0 left-0"
                             :class="{'top-1/2': choice === 'A'}">
                        </div>
                    </transition>
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
                <div v-if="choice" class="mt-4 flex justify-between">
                    <button @click="blur = !blur"
                            class="mdc-button origin-left transform scale-90 mdc-button--raised">
                        <span class="mdc-button__label">
                            {{ $t('Toggle') + ' ' + (choice === 'A' ? 'B' : 'A') }}
                        </span>
                    </button>

                    <button @click="remove"
                            class="mdc-button origin-left transform scale-90 mdc-button--raised">
                        <img width="26" src="/img/icons/remove-card.png" :alt="'Remove #' + card.id"/>
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

import Card from "../../models/Card";
import FlipCard from "../elements/FlipCard";
import PreloadImage from "../../services/PreloadImage";

export default {
    components: {FlipCard},
    data() {
        return {
            card: null,
            choice: null,
            animating: false,
            blur: false,
            removed: false,
            preloadImage: new PreloadImage(),
        }
    },
    mounted() {
        this.$bus.$on('open-card', (card) => {
            this.open(new Card(card.id, card.game));
        });
        this.$bus.$on('close-card', this.close);
    },
    methods: {
        open(card) {
            this.card = card;
            this.choice = null;
            this.animating = false;
            this.blur = false;
            this.removed = false;
            this.$refs['modal'].open();
            this.preloadImage.handle(card.images[1]);
        },
        chose(choice) {
            this.choice = choice;
            this.animating = true;
            this.blur = true;

            // animation done
            setTimeout(() => {
                this.animating = false;
            }, 600);
        },
        remove() {
            if (!this.removed && this.choice && !this.animating) {
                this.removed = true;
                this.$bus.$emit('remove-card', this.card);
                this.close();
            }
        },
        close() {
            this.card = null;
            this.$refs['modal'].close();
        }
    }
}
</script>

<style lang="scss" scoped>
.blur {
    backdrop-filter: blur(4px);
}
</style>
