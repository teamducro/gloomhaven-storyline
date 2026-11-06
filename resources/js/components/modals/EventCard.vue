<template>
    <div>
        <modal ref="modal" :title="card ? ($t(card.translatedType) + ' #' + card.id) : ''" :max-width="'348px'"
               :overflowHidden="animating">
            <template #content>
                <div v-if="card" class="w-full h-full flex flex-col outline-hidden">
                    <div class="relative w-full" style="max-width: 300px;">
                        <flip-card :flipped="!!choice">
                            <template v-slot:front>
                                <webp :src="card.images[0]" :alt="$t(card.translatedType) + ' #' + card.id"
                                      class="w-full rounded-lg sm:rounded-xl"/>
                            </template>
                            <template v-slot:back>
                                <div v-if="card.game === 'gh2'" class="w-full">
                                    <div v-for="(src, index) in card.images.slice(1)" :key="src" class="relative">
                                        <webp :src="src" :alt="$t(card.translatedType) + ' #' + card.id + ' ' + card.outcomes[index]"
                                              class="w-full"/>
                                        <div v-if="blur && card.outcomes[index] !== choice" class="blur-sm absolute inset-0"></div>
                                    </div>
                                </div>
                                <webp v-else :src="card.images[1]" :alt="$t(card.translatedType) + ' #' + card.id"
                                      class="w-full rounded-lg sm:rounded-xl"/>
                            </template>
                        </flip-card>

                        <!-- push buttons under the flip card wit the same aspect ratio -->
                        <webp :src="card.images[0]" class="invisible"></webp>

                        <transition name="fade">
                            <div v-if="blur && card.game !== 'gh2'"
                                 class="blur-sm rounded-lg absolute h-1/2 w-full top-0 left-0"
                                 :class="{'top-1/2': choice === 'A'}">
                            </div>
                        </transition>
                    </div>
                    <a v-if="String(card.id).startsWith('SoX')" class="block mt-2 text-sm link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/thread/2220121/seeker-xorn-bonus-content">
                        {{ $t('Fan-made bonus content by {author}', {author: 'Morthai'}) }}</a>
                    <div v-if="!choice" class="mt-4 flex justify-between">
                        <button v-for="outcome in card.outcomes" :key="outcome" @click="chose(outcome)"
                                class="mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">{{ outcome }}</span>
                        </button>
                        <button v-if="!viaDraw && !appData.read_only && !fromHistory" @click="remove"
                                class="mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__ripple"></span>
                            <img width="26" :src="baseUrl+'/img/icons/remove-card.png'" :alt="'Remove #' + card.id"/>
                        </button>
                    </div>
                    <div v-if="choice" class="mt-4 flex justify-between">
                        <button v-if="card.outcomes.length > 1" @click="blur = !blur"
                                class="mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">
                                {{ $t('Toggle') + ' ' + card.outcomes.filter(outcome => outcome !== choice).join('/') }}
                            </span>
                        </button>

                        <button v-if="!appData.read_only && !fromHistory" @click="remove"
                                class="mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__ripple"></span>
                            <img width="26" :src="baseUrl+'/img/icons/remove-card.png'" :alt="'Remove #' + card.id"/>
                        </button>
                    </div>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>

import Card from "../../models/Card";
import FlipCard from "../elements/FlipCard";
import PreloadImage from "../../services/PreloadImage";
import Helpers from "../../services/Helpers";
import BaseUrl from "../../mixins/BaseUrl";

export default {
    components: {FlipCard},
    mixins: [BaseUrl],
    inject: ['appData'],
    data() {
        return {
            card: null,
            choice: null,
            animating: false,
            blur: false,
            removed: false,
            viaDraw: false,
            fromHistory: false,
            preloadImage: new PreloadImage(),
        }
    },
    mounted() {
        this.$bus.$on('open-event-card', (card) => {
            this.open(card);
        });
        this.$bus.$on('close-event-card', this.close);
    },
    methods: {
        open(card) {
            this.card = card instanceof Card ? card : new Card(card.id, card.game);
            this.choice = card.choice || null;
            this.animating = false;
            this.blur = !!this.choice;
            this.removed = false;
            this.viaDraw = !!card.viaDraw;
            this.fromHistory = !!card.fromHistory;
            this.$refs['modal'].open();
            this.preloadImage.handle(this.card.images[1]);
        },
        async chose(choice) {
            this.choice = choice;
            this.animating = true;
            this.blur = true;
            if (!this.fromHistory) {
                this.$bus.$emit('event-chosen', this.card, choice);
            }

            // animation done
            await Helpers.sleep(600);
            this.animating = false;
        },
        remove() {
            if (!this.removed && !this.animating && !this.fromHistory && (this.choice || !this.viaDraw)) {
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
