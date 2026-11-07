<template>
    <div>
        <modal ref="modal" :title="item ? item.number : ''" :overflowHidden="animating">
            <template #content>
                <!-- Mobile: controls go full width below the image and text. -->
                <div v-if="item" class="w-full h-full grid grid-cols-2 sm:grid-rows-[auto_1fr] gap-x-3 outline-hidden">
                    <div class="sm:row-span-2">
                        <div v-if="item.flip" class="relative cursor-pointer" style="max-width: 400px;" @click="flip">
                            <flip-card :flipped="flipped" class="w-full">
                                <template v-slot:front>
                                    <webp :src="item.image" :alt="$t(item.name)" class="w-full rounded-lg sm:rounded-xl"/>
                                </template>
                                <template v-slot:back>
                                    <webp :src="item.backImage" :alt="$t(item.name)" class="w-full rounded-lg sm:rounded-xl"/>
                                </template>
                            </flip-card>

                            <!-- push the card under the flip card to the same aspect ratio -->
                            <webp :src="item.image" class="invisible"/>

                            <button type="button"
                                    class="mdc-icon-button mdc-button--raised material-icons p-2 bg-black2-50! rounded-full absolute top-0 left-0 m-2 z-5"
                                    @click.stop="flip">
                                flip
                            </button>
                        </div>
                        <webp v-else :src="item.image" :alt="$t(item.name)"
                              class="w-full rounded-lg sm:rounded-xl" style="max-width: 400px;"/>
                    </div>

                    <div class="space-y-2">
                        <p v-if="item._source">
                            <span class="relative w-6 h-4 inline-block">
                                <span class="material-icons outlined absolute">info</span>
                            </span>
                            <add-links-and-icons :text="$t(item.source)"/>
                        </p>
                        <p v-if="item._faq">
                            <span class="relative w-6 h-4 inline-block">
                                <span class="material-icons outlined absolute">help</span>
                            </span>
                            {{ $t(item.faq) }}
                        </p>
                    </div>

                    <buy-item ref="buy-item" :item="item" class="max-sm:col-span-2"/>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
import ItemRepository from "../../repositories/ItemRepository";
import FlipCard from "../elements/FlipCard";
import Helpers from "../../services/Helpers";

export default {
    components: {FlipCard},
    data() {
        return {
            item: null,
            flipped: false,
            animating: false,
            itemRepository: new ItemRepository()
        }
    },
    mounted() {
        this.$bus.$on('open-item', (data) => {
            const item = data.item || this.itemRepository.find(data.id);
            this.open(item);
        });
        this.$bus.$on('open-scenario', this.close);
        this.$bus.$on('close-item', this.close);
        this.$bus.$on('game-selected', this.unsetItem);
    },
    methods: {
        open(item) {
            this.item = item;
            this.flipped = false;
            this.animating = false;

            this.$refs['modal'].open();
            this.$refs['buy-item']?.refresh();
        },
        async flip() {
            this.flipped = !this.flipped;
            this.animating = true;
            await Helpers.sleep(600);
            this.animating = false;
        },
        close() {
            this.unsetItem();
            this.$refs['modal'].close();
        },
        unsetItem() {
            this.item = null;
        }
    }
}
</script>
