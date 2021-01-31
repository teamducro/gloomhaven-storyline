<template xmlns:slot="http://www.w3.org/1999/html">
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div id="items" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <h1 class="mb-4 text-xl">{{ $t('Item designs') }} {{ campaignName }}</h1>

            <data-table
                :columns="columns"
                :sortable="sortable"
                :searchable="searchable"
                :data="items.items"
            >
                <template slot="image" slot-scope="{value}">
                    <div class="relative overflow-hidden h-11 -m-3" style="width: 80px;">
                        <webp :src="value" width="80" class="-mt-4 top-0 absolute max-w-none" :animate="true"/>
                    </div>
                </template>
            </data-table>

        </div>
    </div>
</template>

<script>
import Sheet from "../models/Sheet";
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetCalculations from "../services/SheetCalculations";
import ItemRepository from "../repositories/ItemRepository";

export default {
    mixins: [GetCampaignName, SheetCalculations],
    data() {
        return {
            sheet: null,
            shop: 0,
            items: collect([]),
            campaignName: null,
            loading: true,
            columns: [
                {id: 'image', name: ''},
                {id: 'number', name: 'ID'},
                {id: 'name', name: 'Name'},
                {id: 'slot', name: 'Slot'},
                {id: 'cost', name: 'Cost'},
                {id: 'use', name: 'Use'},
                {id: 'desc', name: 'Effect'}
            ],
            sortable: ['number', 'name', 'slot', 'cost', 'use'],
            searchable: ['number', 'name'],
            storySyncer: new StorySyncer,
            itemRepository: new ItemRepository,
        }
    },
    watch: {
        'sheet.itemDesign': {
            handler() {
                const sheetItems = this.calculateItems(this.sheet.itemDesigns, this.sheet.prosperityIndex);
                this.items = this.itemRepository.findMany(sheetItems);
            },
            deep: true
        }
    },
    mounted() {
        this.render();

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = new Sheet;
            this.shop = this.calculateShop(this.sheet.reputation);
            this.campaignName = this.getCampaignName();

            await this.$nextTick();

            this.loading = false;
        },
        store() {
            if (this.loading) {
                return;
            }

            this.sheet.store();
            this.storySyncer.store();
        }
    }
}
</script>
