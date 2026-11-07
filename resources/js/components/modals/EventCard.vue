<template>
    <div>
        <modal ref="modal" :title="card ? ($t(card.translatedType) + ' #' + card.id) : ''" :max-width="'348px'"
               :overflowHidden="animating">
            <template #content>
                <div v-if="card" class="w-full h-full flex flex-col outline-hidden">
                    <!-- on the wrapper, so clicks on the blur overlays flip too -->
                    <div class="relative w-full" style="max-width: 300px;" :class="{'cursor-pointer': fromHistory}"
                         @click="fromHistory && (flipped = !flipped)">
                        <flip-card :flipped="flipped">
                            <template v-slot:front>
                                <webp :src="card.images[0]" :alt="$t(card.translatedType) + ' #' + card.id"
                                      class="w-full rounded-lg sm:rounded-xl"/>
                            </template>
                            <template v-slot:back>
                                <webp :src="card.images[1]" :alt="$t(card.translatedType) + ' #' + card.id"
                                      class="w-full rounded-lg sm:rounded-xl"/>
                            </template>
                        </flip-card>

                        <transition name="fade">
                            <div v-if="blur && flipped && card.game !== 'gh2'"
                                 class="outcome-blur rounded-lg absolute h-1/2 w-full top-0 left-0"
                                 :class="{'top-1/2': choice === 'A'}">
                            </div>
                        </transition>
                        <!-- GH2e: one back with 1–4 outcomes, blur each one not chosen -->
                        <transition-group name="fade">
                            <div v-for="section in (flipped ? blurredSections : [])" :key="section.outcome"
                                 class="outcome-blur absolute w-full left-0"
                                 :style="{top: section.start + '%', height: (section.end - section.start) + '%'}">
                            </div>
                        </transition-group>
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
                    </div>
                    <div v-if="choice" class="mt-4 flex justify-between">
                        <button v-if="fromHistory" @click="flipped = !flipped"
                                class="mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">{{ $t('Flip') }}</span>
                        </button>
                        <button v-if="flipped && card.outcomes.length > 1" @click="blur = !blur"
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
            flipped: false,
            animating: false,
            blur: false,
            removed: false,
            fromHistory: false,
            preloadImage: new PreloadImage(),
        }
    },
    computed: {
        blurredSections() {
            if (!this.blur || this.card.game !== 'gh2') {
                return [];
            }
            const sections = Object.entries(this.card.sections).sort((a, b) => a[1] - b[1]);
            return sections
                .map(([outcome, start], i) => ({outcome, start, end: sections[i + 1]?.[1] ?? 100}))
                .filter(section => section.outcome !== this.choice);
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
            this.flipped = false;
            this.removed = false;
            this.fromHistory = !!card.fromHistory;
            this.$refs['modal'].open();
            this.preloadImage.handle(this.card.images[1]);
        },
        async chose(choice) {
            this.choice = choice;
            this.flipped = true;
            this.animating = true;
            this.blur = true;
            this.$bus.$emit('event-chosen', this.card, choice);

            // animation done
            await Helpers.sleep(600);
            this.animating = false;
        },
        remove() {
            if (!this.removed && !this.animating && !this.fromHistory && this.choice) {
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
// Not "blur": Tailwind owns that name (filter, which can't blur what is behind an empty overlay)
.outcome-blur {
    backdrop-filter: blur(4px);
}

</style>
