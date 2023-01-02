<template>
    <div v-if="sheet" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Items')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

            <div v-if="Object.keys(sheet.itemDesigns).length" class="absolute right-0 top-0 mt-14 sm:mt-4 mr-4 z-5">
                <dropdown class="items-to-add-dropdown" align="right" width=""
                          @open="dropDownClose = true"
                          @close="dropDownClose = false">
                    <template v-slot:trigger>
                        <button type="button"
                                class="mdc-icon-button mdc-button--raised material-icons p-2 mr-2 mt-2 !bg-black2-50 rounded-full transform transition-transform"
                                :class="{'rotate-45': dropDownClose}">
                            add
                        </button>
                    </template>

                    <div class="w-full">
                        <h2>{{ $t(sheet.game) + ' ' + $t('Items') }}</h2>
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

                        <div class="-ml-2">
                            <checkbox-with-label id="cross-game-items-enabled-checkbox"
                                             class="my-2"
                                             :label="$t('Enable items from other games')"
                                             :checked.sync="sheet.crossGameItemsEnabled"
                                             @change="refreshItems();store()"/>

                            <ul v-if="sheet.crossGameItemsEnabled">
                                <li v-for="code in Object.keys(sheet.crossGameItems)">
                                    <checkbox-with-label v-if="code !== currentGame"
                                                         :id="code+'-items'"
                                                         :label="$t(code)"
                                                         :checked.sync="sheet.crossGameItems[code]"
                                                         @change="refreshItems();store()"/>
                                </li>
                            </ul>
                        </div>

                    </div>
                </dropdown>
            </div>

            <div v-if="costModifier != 0" class="my-4">
                <h2 class="mb-2">{{ $t('Shop modifier') }}:
                    <span>{{ costModifier }} {{ $t('Gold') }}</span>
                </h2>
                <p class="text-sm">
                    {{ $t('The cost of items displayed is modified by this amount.') }}
                </p>
            </div>

            <div class="flex justify-between flex-wrap items-end">
                <div>
                    <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="search-field">
                        <span class="mdc-text-field__ripple"></span>
                        <input class="mdc-text-field__input" aria-labelledby="item-search"
                               type="text" name="item-search"
                               v-model="query" @keyup="applySearch">
                        <span class="mdc-floating-label" id="item-search">{{ $t('Search name or nr') }}</span>
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
                        :data="items.values().items"
                        @rowClick="openItemModel"
                        :translatable="['name', 'desc']"
                        :noResults="$t('No items available')"
            >
                <template slot="image" slot-scope="{value, row}">
                    <div class="overflow-hidden h-full -m-1 md:-m-3 top-0 left-0 cursor-pointer">
                        <webp :src="value" width="80" class="-mt-2 top-0 absolute max-w-none rounded"
                              :alt="$t(row.name)" :animate="true"/>
                    </div>
                    <div class="w-16 md:w-12 h-2"></div>
                </template>
                <span slot="number" slot-scope="{value, row}">
                    {{ value }}<br>
                    <span class="lg:hidden">
                        <webp :src="row.slot" class="inline-block mr-2" width="20"/>
                    </span>
                </span>
                <span slot="name" class="xs:whitespace-nowrap" slot-scope="{value, row}">
                    {{ $t(value) }}<br>
                    <span class="lg:hidden">
                        <webp :src="row.use" class="hidden sm:inline-block mr-2" width="20"/>
                        <span class="inline-block mr-2">
                            {{ row.count - itemAvailability.uses(row.id) }}/{{ row.count }}
                        </span>
                        <span class="inline-block md:hidden">{{ row.cost + costModifier }}</span>
                    </span>
                </span>
                <span slot="cost" slot-scope="{value}">
                    {{ value + costModifier }}
                </span>
                <template slot="availability" slot-scope="{value, row}">
                    {{ row.count - itemAvailability.uses(row.id) }} / {{ row.count }}
                </template>
                <template slot="desc" slot-scope="{value}">
                    <add-links-and-icons :text="$t(value)"/>
                </template>
            </data-table>
        </div>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetCalculations from "../services/SheetCalculations";
import ItemRepository from "../repositories/ItemRepository";
import SheetRepository from "../repositories/SheetRepository";
import ScenarioRepository from "../repositories/ScenarioRepository";
import ItemAvailability from "../services/ItemAvailability";
import GameData from "../services/GameData";

export default {
    mixins: [GetCampaignName, SheetCalculations],
    data() {
        return {
            selectedItem: null,
            sheet: null,
            costModifier: 0,
            prosperity: 1,
            items: collect({}),
            itemAvailability: null,
            campaignName: null,
            loading: true,
            games: [],
            query: '',
            search: {},
            selectedFilter: null,
            filters: ['body', 'head', 'legs', 'one-hand', 'small-item', 'two-hands'],
            sortable: ['number', 'name', 'cost'],
            field: null,
            dropDownClose: false,
            storySyncer: new StorySyncer,
            itemRepository: new ItemRepository,
            scenarioRepository: new ScenarioRepository,
            sheetRepository: new SheetRepository,
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
    computed: {
        columns() {
            let columns = [
                {id: 'image', name: 'Card', classes: 'hidden sm:table-cell'},
                {id: 'number', name: 'Nr'},
                {id: 'name', name: 'Name'},
                {id: 'game', name: 'Game'},
                {id: 'slot', name: 'Slot', classes: 'hidden lg:table-cell'},
                {id: 'cost', name: 'Cost', classes: 'hidden md:table-cell'},
                {id: 'availability', name: 'Avail', classes: 'hidden lg:table-cell'},
                {id: 'use', name: 'Use', classes: 'hidden lg:table-cell'},
                {id: 'desc', name: 'Effect'}
            ]

            // Remove the game column cross game items isn't enabled or if the selected game isn't CS.
            if (this.sheet && this.currentGame !== 'cs' && !this.sheet.crossGameItemsEnabled) {
                columns = columns.filter(column => column.id !== 'game');
            }

            return columns;
        },
        currentGame() {
            return this.sheet.game === 'fc' ? 'gh' : this.sheet.game;
        }
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = this.sheetRepository.make(app.game);
            this.costModifier = this.calculateCostModifier(this.sheet.reputation || 0);
            this.campaignName = this.getCampaignName();
            this.itemAvailability = new ItemAvailability(this.sheet);

            await this.$nextTick();

            this.loading = false;

            this.field = new MDCTextField(this.$refs['search-field']);
        },
        refreshItems() {
            let sheetItems;

            // Get all manual unlocked items from the sheet, prefixed with the current game.
            const unlockedItems = this.unlockedItems(this.sheet.itemDesigns, this.currentGame);

            // Add auto unlocked items, based on prosperity level or completed scenarios.
            if (this.currentGame === 'jotl') {
                sheetItems = this.calculateItemsJotl(unlockedItems, this.scenarioRepository);
            }
            else {
                sheetItems = this.calculateItemsGh(unlockedItems, this.sheet.prosperityIndex);
            }

            // Find items from base game.
            let items = this.itemRepository.findMany(sheetItems);

            // Add items from other games, if enabled.
            if (this.sheet.crossGameItemsEnabled) {
                const otherGames = collect(this.sheet.crossGameItems).filter().keys().all();
                otherGames.forEach(game => {
                    if (game !== this.currentGame) {
                        items = collect({...items.all(), ...this.itemRepository.fromGame(game).all()});
                    }
                });
            }

            this.items = items
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
            this.$bus.$emit('open-item', {item});
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
