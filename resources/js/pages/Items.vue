<template xmlns:slot="http://www.w3.org/1999/html">
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div id="items" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <h1 class="mb-4 text-xl">{{ $t('Item designs') }} {{ campaignName }}</h1>

            <div class="mb-4">
                <h2 class="mb-2">{{ $t('Shop modifier') }}:
                    <span>{{ shop }} {{ $t('Gold') }}</span>
                </h2>
                <p v-if="shop != 0" class="text-sm">The cost of items displayed is modified by this amount.</p>
            </div>

            <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="search-field">
                <span class="mdc-text-field__ripple"></span>
                <input class="mdc-text-field__input" aria-labelledby="item-search"
                       type="text" name="item-search"
                       v-model="query" @keyup="filter">
                <span class="mdc-floating-label" id="item-search">Search</span>
                <span class="mdc-line-ripple"></span>
            </label>

            <data-table class="mt-2"
                        :columns="columns"
                        :sortable="sortable"
                        :searchable="searchable"
                        :data="items.items"
            >
                <template slot="image" slot-scope="{value, row}">
                    <div class="overflow-hidden h-full -m-1 md:-m-3 top-0 left-0 cursor-pointer"
                         @click="openItemModel(row)">
                        <webp :src="value" width="80" class="-mt-2 top-0 absolute max-w-none" :animate="true"/>
                    </div>
                    <div class="w-16 md:w-12 h-2"></div>
                </template>
                <span slot="cost" slot-scope="{value}">
                    {{ value + shop }}
                </span>
            </data-table>

            <item-model v-if="selectedItem" :item="selectedItem" ref="item-model"></item-model>
        </div>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";
import Sheet from "../models/Sheet";
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetCalculations from "../services/SheetCalculations";
import ItemRepository from "../repositories/ItemRepository";

export default {
    mixins: [GetCampaignName, SheetCalculations],
    data() {
        return {
            selectedItem: null,
            sheet: null,
            query: '',
            shop: 0,
            items: collect([]),
            campaignName: null,
            loading: true,
            columns: [
                {id: 'image', name: 'Card'},
                {id: 'number', name: 'Nr'},
                {id: 'name', name: 'Name'},
                {id: 'slot', name: 'Slot'},
                {id: 'cost', name: 'Cost'},
                {id: 'use', name: 'Use'},
                {id: 'desc', name: 'Effect'}
            ],
            sortable: ['number', 'name', 'slot', 'cost', 'use'],
            searchable: ['number', 'name'],
            field: null,
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

            this.field = new MDCTextField(this.$refs['search-field']);
        },
        store() {
            if (this.loading) {
                return;
            }

            this.sheet.store();
            this.storySyncer.store();
        },
        filter() {

        },
        async openItemModel(item) {
            this.selectedItem = item;
            await this.$nextTick();
            this.$refs['item-model'].open();
        },
    }
}
</script>
