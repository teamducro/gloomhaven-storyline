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
                    <p class="pt-4">
                        {{ $t('Availability') }}: {{ item.count - characters.count() }} / {{ item.count }}
                    </p>
                    <character-icon v-for="(character, uuid) in characters.items" :key="uuid"
                                    :player="uuid" :character="character.id" class="w-6 mr-2 inline-block"
                                    @click="close"/>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import ItemRepository from "../../repositories/ItemRepository";
import SheetRepository from "../../repositories/SheetRepository";

export default {
    data() {
        return {
            item: null,
            characters: {},
            itemRepository: new ItemRepository(),
            sheetRepository: new SheetRepository()
        }
    },
    mounted() {
        this.$bus.$on('open-item', (data) => {
            const item = data.item || this.itemRepository.find(data.id);
            this.open(item);
        });
        this.$bus.$on('open-scenario', (data) => {
            this.close();
        });
        this.$bus.$on('close-item', () => {
            this.close();
        });
        this.$bus.$on('game-selected', () => {
            this.unsetItem();
        });
    },
    methods: {
        open(item) {
            this.item = item;

            const sheet = this.sheetRepository.make(app.game);
            this.characters = collect(sheet.characters)
                .filter((character) => {
                    return character.items[item.id] === true;
                });

            this.$refs['modal'].open();
        },
        close() {
            this.unsetItem();
            this.$refs['modal'].close();
        },
        unsetItem() {
            this.item = null;
            this.characters = {};
        }
    }
}
</script>
