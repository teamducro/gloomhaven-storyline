<template xmlns:slot="http://www.w3.org/1999/html">
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div class="relative bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Items')]"
                  :icons="['assignment', 'style']"
                  :urls="['party', 'items']"
                  :active="$t('Items')"
            >
            </tabs>
            <h1 class="hidden sm:inline text-xl">{{ campaignName }}</h1>

            <div class="absolute right-0 top-0 mt-4 mr-4 z-5">
                <dropdown class="items-to-add-dropdown" align="right" width=""
                          @open="dropDownClose = true"
                          @close="dropDownClose = false">
                    <template v-slot:trigger>
                        <button type="button"
                                class="mdc-icon-button mdc-button--raised material-icons p-2 mr-2 mt-2 i-bg-black2-50 rounded-full transform transition-transform"
                                :class="{'rotate-45': dropDownClose}">
                            add
                        </button>
                    </template>

                    <div class="w-full">
                        <h2>{{ $t('Add Items') }}</h2>
                        <ul class="flex flex-row flex-wrap -mx-2">
                            <li v-for="(checked, item) in sheet.itemDesigns"
                                class="flex items-center">
                                <checkbox group="items"
                                          :checked="checked"
                                          :id="'item-'+item"
                                          @change="changeItem"></checkbox>
                                <span class="w-8 font-title">{{ item }}</span>
                            </li>
                        </ul>
                    </div>
                </dropdown>
            </div>

            <div class="my-4">
                <h2 class="mb-2">{{ $t('Shop modifier') }}:
                    <span>{{ shop }} {{ $t('Gold') }}</span>
                </h2>
                <p v-if="shop != 0" class="text-sm">The cost of items displayed is modified by this amount.</p>
            </div>

            <div class="flex justify-between flex-wrap">
                <div>
                    <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="search-field">
                        <span class="mdc-text-field__ripple"></span>
                        <input class="mdc-text-field__input" aria-labelledby="item-search"
                               type="text" name="item-search"
                               v-model="query" @keyup="applySearch">
                        <span class="mdc-floating-label" id="item-search">{{ $t('Number or Name') }}</span>
                        <span class="mdc-line-ripple"></span>
                    </label>
                </div>

                <div>
                    <ul class="flex">
                        <li v-for="filter in filters"
                            class="p-2 cursor-pointer rounded-full"
                            :class="{'bg-black2-75' : selectedFilter === filter}"
                            @click="applyFilter(filter)">
                            <webp :src="'/img/icons/equipment/' + filter + '.png'" :alt="filter" width="20"/>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="items" class="m-auto mt-4 max-w-party">

            <data-table :columns="columns"
                        :sortable="sortable"
                        :initialSearch="search"
                        :data="items.items"
                        odd-class="bg-black2-10"
                        @rowClick="openItemModel"
                        :noResults="$t('No items found')"
            >
                <template slot="image" slot-scope="{value, row}">
                    <div class="overflow-hidden h-full -m-1 md:-m-3 top-0 left-0 cursor-pointer">
                        <webp :src="value" width="80" class="-mt-2 top-0 absolute max-w-none rounded"
                              :animate="true"/>
                    </div>
                    <div class="w-16 md:w-12 h-2"></div>
                </template>
                <span slot="cost" slot-scope="{value}">
                    {{ value + shop }}
                </span>
                <template slot="desc" slot-scope="{value}">
                    <component v-bind:is="addIcons(value)"></component>
                </template>
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
            shop: 0,
            prosperity: 1,
            items: collect([]),
            campaignName: null,
            loading: true,
            query: '',
            search: {},
            columns: [
                {id: 'image', name: 'Card', classes: 'hidden sm:table-cell'},
                {id: 'number', name: 'Nr'},
                {id: 'name', name: 'Name'},
                {id: 'slot', name: 'Slot'},
                {id: 'cost', name: 'Cost'},
                {id: 'use', name: 'Use', classes: 'hidden md:table-cell'},
                {id: 'desc', name: 'Effect'}
            ],
            selectedFilter: null,
            filters: ['body', 'head', 'legs', 'one-hand', 'small-item', 'two-hands'],
            sortable: ['number', 'name', 'slot', 'cost', 'use'],
            field: null,
            dropDownClose: false,
            storySyncer: new StorySyncer,
            itemRepository: new ItemRepository,
        }
    },
    watch: {
        'sheet.itemDesigns': {
            handler: 'refreshItems',
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
            this.shop = this.calculateShop(this.sheet.reputation || 0);
            this.campaignName = this.getCampaignName();

            await this.$nextTick();

            this.loading = false;

            this.field = new MDCTextField(this.$refs['search-field']);
        },

        refreshItems() {
            const sheetItems = this.calculateItems(this.sheet.itemDesigns, this.sheet.prosperityIndex);
            this.items = this.itemRepository.findMany(sheetItems);
        },

        changeItem(id, isChecked) {
            const item = parseInt(id.replace('item-', ''));
            Vue.set(this.sheet.itemDesigns, item, isChecked);
            this.refreshItems();
            this.store();
        },

        store() {
            if (this.loading) {
                return;
            }

            this.sheet.store();
            this.storySyncer.store();
        },
        applySearch() {
            Vue.delete(this.search, 'number');
            Vue.delete(this.search, 'name');

            if (this.query) {
                Vue.set(this.search, isNaN(this.query) ? 'name' : 'number', this.query);
            }
        },
        applyFilter(filter) {
            if (this.selectedFilter === filter) {
                this.selectedFilter = null;
                Vue.delete(this.search, 'slot');
            } else {
                this.selectedFilter = filter;
                Vue.set(this.search, 'slot', filter);
            }
        },
        async openItemModel(item) {
            this.selectedItem = item;
            await this.$nextTick();
            this.$refs['item-model'].open();
        },
        addIcons(desc) {
            collect({
                '{Shield}': 'Shield <webp src="/img/icons/general/shield.png" width="20" class="inline"/>',
                '{Heal}': 'Heal <webp src="/img/icons/general/heal.png" width="20" class="inline"/>',
                '{Attack}': 'Attack <webp src="/img/icons/general/attack.png" width="20" class="inline"/>',
                Range: 'Range <webp src="/img/icons/general/range.png" width="20" class="inline"/>',
                Move: 'Move <webp src="/img/icons/general/move.png" width="20" class="inline"/>',
                Jump: 'Jump <webp src="/img/icons/general/jump.png" width="20" class="inline"/>',
                Recover: 'Recover <webp src="/img/icons/general/recover_white.png" width="20" class="inline"/>',
                Refresh: 'Refresh <webp src="/img/icons/general/refresh_white.png" width="20" class="inline"/>',
                Flying: 'Flying <webp src="/img/icons/general/flying.png" width="20" class="inline"/>',
                '{modifier_minus_one}': '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                '{-1}': '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                '{any}': '<webp src="/img/icons/elements/any.png" width="20" class="inline"/>',
                '{use}': '<webp src="/img/icons/elements/use.png" width="20" class="inline"/>',
                '{dark}': '<webp src="/img/icons/elements/dark.png" width="20" class="inline"/>',
                '{earth}': '<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>',
                '{fire}': '<webp src="/img/icons/elements/fire.png" width="20" class="inline"/>',
                '{ice}': '<webp src="/img/icons/elements/ice.png" width="20" class="inline"/>',
                '{wind}': '<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>',
                '{light}': '<webp src="/img/icons/elements/light.png" width="20" class="inline"/>',
                '{anyX}': '<webp src="/img/icons/elements/anyX.png" width="20" class="inline"/>',
                '{darkX}': '<webp src="/img/icons/elements/darkX.png" width="20" class="inline"/>',
                '{earthX}': '<webp src="/img/icons/elements/earthX.png" width="20" class="inline"/>',
                '{fireX}': '<webp src="/img/icons/elements/fireX.png" width="20" class="inline"/>',
                '{iceX}': '<webp src="/img/icons/elements/iceX.png" width="20" class="inline"/>',
                '{windX}': '<webp src="/img/icons/elements/windX.png" width="20" class="inline"/>',
                '{lightX}': '<webp src="/img/icons/elements/lightX.png" width="20" class="inline"/>',
                '{multi_attack.cleave_0_1}': '<webp src="/img/icons/aoe/cleave_0_1.png" width="40" class="inline"/>',
                '{multi_attack.cone_0_1}': '<webp src="/img/icons/aoe/cone_0_1.png" width="40" class="inline"/>',
                '{multi_attack.cone_1_1}': '<webp src="/img/icons/aoe/cone_1_1.png" width="40" class="inline"/>',
                '{multi_attack.cube_2_2}': '<webp src="/img/icons/aoe/cube_2_2.png" width="40" class="inline"/>',
                '{multi_attack.line_0_1_1}': '<webp src="/img/icons/aoe/line_0_1_1.png" width="60" class="inline"/>',
                STRENGTHEN: 'STRENGTHEN <webp src="/img/icons/status/strengthen.png" width="20" class="inline"/>',
                PUSH: 'PUSH <webp src="/img/icons/status/push.png" width="20" class="inline"/>',
                PULL: 'PULL <webp src="/img/icons/status/pull.png" width="20" class="inline"/>',
                IMMOBILIZE: 'IMMOBILIZE <webp src="/img/icons/status/immobilize.png" width="20" class="inline"/>',
                INVISIBLE: 'INVISIBLE <webp src="/img/icons/status/invisible.png" width="20" class="inline"/>',
                PIERCE: 'PIERCE <webp src="/img/icons/status/pierce.png" width="20" class="inline"/>',
                STUN: 'STUN <webp src="/img/icons/status/stun.png" width="20" class="inline"/>',
                POISON: 'POISON <webp src="/img/icons/status/poison.png" width="20" class="inline"/>',
                WOUND: 'WOUND <webp src="/img/icons/status/wound.png" width="20" class="inline"/>',
                MUDDLE: 'MUDDLE <webp src="/img/icons/status/muddle.png" width="20" class="inline"/>',
                CURSE: 'CURSE <webp src="/img/icons/status/curse.png" width="20" class="inline"/>',
                BLESS: 'BLESS <webp src="/img/icons/status/bless.png" width="20" class="inline"/>',
                REGENERATE: 'REGENERATE <webp src="/img/icons/status/regenerate.png" width="20" class="inline"/>',
            }).each((icon, key) => {
                desc = desc.replaceAll(key, icon);
            });

            return {
                template: `<span>${desc}</span>`
            };
        }
    }
}
</script>
<style lang="scss">
.items-to-add-dropdown .dropdown {
    width: calc(100vw - 4.8rem);
}

@screen md {
    .items-to-add-dropdown .dropdown {
        width: calc(100vw - 6.8rem);
        max-width: 1006px;
    }
}
</style>
