<template>
    <div>
        <modal ref="modal" :title="item ? item.number : ''">
            <div v-if="item" slot="content" class="w-full h-full flex outline-none">
                <div class="flex-1 mr-3">
                    <webp :src="item.image" :alt="$t(item.name)"
                          class="w-full rounded-lg sm:rounded-xl" style="max-width: 400px;"/>
                </div>

                <div class="flex-1 space-y-2">
                    <p v-if="item._source">
                        <span class="relative w-6 h-4 inline-block">
                            <span class="material-icons absolute">info_outline</span>
                        </span>
                        <add-links-and-icons :text="$t(item.source)"/>
                    </p>
                    <p v-if="item._faq">
                        <span class="relative w-6 h-4 inline-block">
                            <span class="material-icons absolute">help_outline</span>
                        </span>
                        {{ $t(item.faq) }}
                    </p>

                    <buy-item ref="buy-item" :item="item"/>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import ItemRepository from "../../repositories/ItemRepository";

export default {
    data() {
        return {
            item: null,
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

            this.$refs['modal'].open();
            this.$refs['buy-item']?.refresh();
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
