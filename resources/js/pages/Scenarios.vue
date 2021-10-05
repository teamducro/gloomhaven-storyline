<template>
    <div class="pt-12 pb-4 px-4 flex justify-center w-full">

        <div class="fixed right-0 top-0 mt-1 z-5">
            <dropdown ref="filter-dropdown" align="right">
                <template v-slot:trigger>
                    <button type="button"
                            class="mdc-icon-button mdc-button--raised material-icons p-2 mr-2 mt-2 !bg-black2-50 rounded-full"
                            :class="{'text-primary': filterEnabled}">
                        filter_list
                    </button>
                </template>

                <ul class="mdc-list overflow-y-auto" style="max-height: calc(100vh - 100px)"
                    ref="filter" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                    <li class="mdc-list-item cursor-pointer" @click="resetFilter(true)">
                        <span class="mdc-list-item__text">Clear filter</span>
                    </li>

                    <li role="separator" class="mdc-list-divider !my-2"></li>

                    <li v-for="state in states"
                        class="mdc-list-item cursor-pointer"
                        :class="{'mdc-list-item--activated': stateFilter === state}"
                        @click="setStateFilter(state)">
                        <span class="mdc-list-item__text capitalize">{{ state }}</span>
                    </li>
                    <li class="mdc-list-item cursor-pointer"
                        :class="{'mdc-list-item--activated': missedTreasuresFilter}"
                        @click="setMissedTreasuresFilter">
                        <span class="mdc-list-item__text">Missed Treasures</span>
                    </li>

                    <li v-if="regions.length" role="separator" class="mdc-list-divider !my-2"></li>

                    <li v-if="scenarios && regions.length"
                        v-for="region in regions"
                        class="mdc-list-item cursor-pointer"
                        :class="{'mdc-list-item--activated': regionFilter.includes(region.id)}"
                        @click="toggleRegionFilter(region.id)">
                        <span class="mdc-list-item__text">{{ region.name }}</span>
                    </li>
                </ul>
            </dropdown>
        </div>

        <div v-if="scenarios" id="scenarios" class="m-auto mt-4 max-w-party">
            <data-table :columns="columns"
                        :sortable="sortable"
                        :data="scenarios.items"
                        odd-class="bg-black2-10"
                        :initialSearch="applyFilter"
                        :sortFunctions="sortFunctions"
                        :translatable="translatable"
                        @rowClick="open"
            >
                <template slot="row" slot-scope="{row}">
                    <template v-if="row.isHidden()">
                        <td @click="open(row)" colspan="2"></td>
                        <td @click="open(row)"
                            colspan="100" class="relative px-1 py-2 md:p-3 overflow-hidden"
                            :class="{'opacity-50': !row.is_side}">#{{ row.id }}
                        </td>
                    </template>
                </template>
                <template slot="image" slot-scope="{value, row}">
                    <webp :src="'/img/scenarios/' + row.id + '.png'"
                          class="w-16 mr-4 my-1"
                          :alt="row.name"/>
                </template>
                <template slot="state" slot-scope="{value, row}">
                    <i v-if="row.isRequired()"
                       class="material-icons text-required text-2xl mr-2">error_outline</i>
                    <i v-else-if="row.isBlocked()"
                       class="material-icons text-incomplete text-2xl mr-2">highlight_off</i>
                    <i v-else-if="row.isComplete()"
                       class="material-icons text-2xl mr-2">check_circle_outline</i>
                    <i v-else-if="row.isIncomplete()"
                       class="material-icons text-complete text-2xl mr-2">radio_button_unchecked</i>
                </template>
                <template slot="regions" slot-scope="{value, row}">
                    <span v-if="value">{{ value.pluck('name').map(name => $t(name)).join(', ') }}</span>
                </template>
            </data-table>
        </div>
    </div>
</template>

<script>
import {MDCList} from "@material/list/component";
import ScenarioRepository from "../repositories/ScenarioRepository";
import {ScenarioState} from "../models/ScenarioState";
import When from "../services/When";
import Helpers from "../services/Helpers";

export default {
    data() {
        return {
            list: null,
            scenarios: null,
            regionFilter: [],
            missedTreasuresFilter: null,
            stateFilter: null,
            regions: [],
            columns: [],
            sortFunctions: {
                image: 'id',
                title: 'id',
                regions: this.sortRegion,
                chapter_name: this.sortChapter
            },
            sortable: ['image', 'state', 'title', 'regions', 'chapter_name', 'lootedAllTreasures', 'is_side'],
            translatable: ['chapter_name'],
            states: [ScenarioState.incomplete],
            scenarioRepository: new ScenarioRepository()
        }
    },
    mounted() {
        if (app.scenarios) {
            this.setScenarios();
        }

        this.$bus.$on('scenarios-updated', this.setScenarios);
    },
    destroyed() {
        this.$bus.$off('scenarios-updated', this.setScenarios);
    },
    computed: {
        filterEnabled() {
            return this.regionFilter.length || this.missedTreasuresFilter || this.stateFilter;
        }
    },
    methods: {
        async setScenarios() {
            this.scenarios = app.scenarios;
            this.regions = this.scenarioRepository.fetchRegionsWithScenarios().items;

            this.columns = (new When).filter([
                {id: 'image', name: 'Sticker'},
                {id: 'state', name: 'State'},
                {id: 'title', name: 'Name'},
                new When(this.regions.length, {id: 'regions', name: 'Region', classes: 'hidden sm:table-cell'}),
                {id: 'chapter_name', name: 'Chapter', classes: 'hidden md:table-cell'},
                {id: 'lootedAllTreasures', name: 'Looted', classes: 'hidden xs:table-cell'},
                {id: 'is_side', name: 'Side', classes: 'hidden sm:table-cell'}
            ]);
        },
        open(scenario) {
            if (scenario.isVisible() || scenario.is_side) {
                this.$bus.$emit('open-scenario', {
                    id: scenario.id
                });
            }
        },
        applyFilter(scenario) {
            // Only show scenarios from selected game (GH/FC)
            if (scenario.game && app.game && scenario.game !== app.game) {
                return false;
            }

            // Filter is not applied
            if (!this.regionFilter.length && !this.missedTreasuresFilter && !this.stateFilter) {
                return true;
            }

            // Apply region
            if (this.regionFilter.length) {
                let inRegion = false;
                this.regionFilter.forEach((region) => {
                    if (scenario.inRegion(region)) {
                        inRegion = true;
                    }
                });
                if (!inRegion) {
                    return false;
                }
            }

            // Apply other filters
            if (this.stateFilter) {
                return scenario.state === this.stateFilter;
            } else if (this.missedTreasuresFilter) {
                return scenario.missedTreasures;
            }

            return true;
        },
        sortRegion(a, b) {
            let regionA = a.regions ? a.regions.pluck('name').first() : null;
            let regionB = b.regions ? b.regions.pluck('name').first() : null;

            return this.scenarioSort(a, regionA, b, regionB);
        },
        sortChapter(a, b) {
            return this.scenarioSort(a, a.chapter_name, b, b.chapter_name);
        },
        scenarioSort(a, valueA, b, valueB) {
            if ((a.isHidden() && b.isHidden()) || (!valueA && !valueB)) {
                return 0;
            }
            if (!valueA || a.isHidden()) {
                return 1;
            }
            if (!valueB || b.isHidden()) {
                return -1;
            }

            return new Intl.Collator().compare(valueA, valueB);
        },
        toggleRegionFilter(id) {
            this.regionFilter.includes(id)
                ? this.regionFilter.splice(this.regionFilter.indexOf(id), 1)
                : this.regionFilter.push(id);
        },
        setMissedTreasuresFilter() {
            if (!this.missedTreasuresFilter) {
                this.resetFilter();
                this.missedTreasuresFilter = true;
            } else {
                this.resetFilter();
            }
        },
        setStateFilter(state) {
            if (this.stateFilter !== state) {
                this.resetFilter();
                this.stateFilter = state;
            } else {
                this.resetFilter();
            }
        },
        resetFilter(clearRegions = false) {
            this.missedTreasuresFilter = null;
            this.stateFilter = null;
            if (clearRegions) {
                this.$refs['filter-dropdown'].close();
                this.regionFilter = [];
            }
        }
    }
}
</script>
