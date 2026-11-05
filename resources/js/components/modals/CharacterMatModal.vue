<template>
    <div>
        <modal ref="modal" :title="character ? $t(character.characterName) : ''" max-width="none"
               class="character-mat-modal" :class="{portrait: character && character.hasPortraitMat}"
               :overflowHidden="animating">
            <template #content>
                <div v-if="character" id="character-mat" class="w-full h-full flex flex-col outline-none">
                    <div class="relative w-full cursor-pointer" @click="flip">
                        <flip-card :flipped="flipped">
                            <template v-slot:front>
                                <webp :src="character.matImages[0]" :alt="$t(character.characterName)"
                                      class="w-full rounded-lg sm:rounded-xl"/>
                            </template>
                            <template v-slot:back>
                                <webp :src="character.matImages[1]" :alt="$t(character.characterName)"
                                      class="w-full rounded-lg sm:rounded-xl"/>
                            </template>
                        </flip-card>

                        <!-- push content under the flip card with the same aspect ratio -->
                        <webp :src="character.matImages[0]" class="invisible w-full"></webp>
                    </div>
                </div>
            </template>
            <template #buttons>
                <button id="flip-character-mat" type="button" class="mdc-button" @click="flip">
                    <i class="material-icons mdc-button__icon" aria-hidden="true">flip</i>
                    <span class="mdc-button__label">{{ $t('Flip') }}</span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
import FlipCard from "../elements/FlipCard";
import Helpers from "../../services/Helpers";

export default {
    components: {FlipCard},
    data() {
        return {
            character: null,
            flipped: false,
            animating: false,
        }
    },
    mounted() {
        this.$bus.$on('open-character-mat', this.open);
    },
    methods: {
        open(character) {
            this.character = character;
            this.flipped = false;
            this.animating = false;
            this.$refs['modal'].open();
        },
        async flip() {
            this.flipped = !this.flipped;
            this.animating = true;

            // animation done
            await Helpers.sleep(600);
            this.animating = false;
        }
    }
}
</script>

<style lang="scss">
// As large as the viewport allows while keeping the mat's aspect ratio; the 220px is the dialog's title, buttons and padding.
.mdc-dialog.character-mat-modal .mdc-dialog__surface {
    width: min(1000px, calc(100vw - 32px), calc((100vh - 220px) * 1.53 + 48px));
    max-width: none;
}

.mdc-dialog.character-mat-modal.portrait .mdc-dialog__surface {
    width: min(648px, calc(100vw - 32px), calc((100vh - 220px) * .653 + 48px));
}
</style>
