<template>
    <div>
        <modal ref="modal" :title="card ? ($t(card.translatedType) + ' #' + card.id) : ''" :max-width="'348px'"
               :overflowHidden="animating">
            <div v-if="card" slot="content" class="w-full h-full flex flex-col outline-none">
                <div class="relative w-full" style="max-width: 300px;">
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

                    <!-- push buttons under the flip card wit the same aspect ratio -->
                    <webp :src="card.images[0]" class="invisible"></webp>

                </div>
            </div>
        </modal>
    </div>
</template>

<script>

import Card from "../../models/Card";
import FlipCard from "../elements/FlipCard";
import PreloadImage from "../../services/PreloadImage";
import Helpers from "../../services/Helpers";

export default {
    components: {FlipCard},
    data() {
        return {
            card: null,
            flipped: true,
            animating: false,
            preloadImage: new PreloadImage(),
        }
    },
    mounted() {
        this.$bus.$on('open-default-card', (card) => {
            this.open(card);
        });
        this.$bus.$on('close-default-card', this.close);
    },
    methods: {
        async open(card) {
            this.card = card instanceof Card ? card : new Card(card.id, card.game);
            this.flipped = true;
            this.animating = false;
            this.$refs['modal'].open();
            await this.preloadImage.handle(card.images[0]);
            await Helpers.sleep(100);
            this.flip();
        },
        async flip() {
            this.flipped = false;
            this.animating = true;

            // animation done
            await Helpers.sleep(600);
            this.animating = false;
        },
        close() {
            this.card = null;
            this.$refs['modal'].close();
        }
    }
}
</script>
