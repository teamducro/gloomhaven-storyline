<template>
    <div class="pt-12 pb-4 px-4 flex justify-center w-full">

        <div class="fixed right-0 top-0 mt-1 z-5">
            <dropdown align="right">
                <template v-slot:trigger>
                    <button type="button" class="mdc-icon-button material-icons p-4"
                            :class="{'text-primary': filterEnabled}">
                        filter_list
                    </button>
                </template>

                <ul class="mdc-list"
                    ref="filter" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                    <li class="mdc-list-item cursor-pointer" @click="resetFilter()">
                        <span class="mdc-list-item__text">Clear filter</span>
                    </li>

                    <li role="separator" class="mdc-list-divider i-my-2"></li>

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

                    <li role="separator" class="mdc-list-divider i-my-2"></li>

                    <li v-for="region in scenarioRepository.regions.items"
                        class="mdc-list-item cursor-pointer"
                        :class="{'mdc-list-item--activated': regionFilter === region.id}"
                        @click="setRegionFilter(region.id)">
                        <span class="mdc-list-item__text">{{ region.name }}</span>
                    </li>
                </ul>
            </dropdown>
        </div>

        <ul v-if="scenarios" id="scenarios" class="mdc-list bg-black2-25 p-2 rounded-lg mt-4" ref="list">
            <li v-for="scenario in scenarios.items"
                v-show="applyFilter(scenario)"
                :key="scenario.id"
                class="mdc-list-item h-auto cursor-pointer"
                :data-id="scenario.id"
                :tabindex="scenario.id">
                <template v-if="scenario.isVisible()">
                    <span class="mdc-list-item__text flex items-center">
                        <webp :src="'/img/scenarios/' + scenario.id + '.png'"
                              class="w-16 mr-4 my-1"
                              :alt="scenario.name"/>
                        <i v-if="scenario.isRequired()"
                           class="material-icons text-required text-2xl mr-2">error_outline</i>
                        <i v-else-if="scenario.isBlocked()"
                           class="material-icons text-incomplete text-2xl mr-2">highlight_off</i>
                        <i v-else-if="scenario.isComplete()"
                           class="material-icons text-2xl mr-2">check_circle_outline</i>
                        <i v-else
                           class="material-icons text-complete text-2xl mr-2">radio_button_unchecked</i>
                        {{ scenario.title }}
                    </span>
                </template>
                <template v-else-if="scenario.is_side">
                    <span class="mdc-list-item__text pl-28">
                        #{{ scenario.id }}
                    </span>
                </template>
                <template v-else>
                    <span class="mdc-list-item__text opacity-50 pl-28">
                        #{{ scenario.id }}
                    </span>
                </template>
            </li>
        </ul>
    </div>
</template>

<script>
    import {MDCList} from "@material/list/component";
    import ScenarioRepository from "../repositories/ScenarioRepository";
    import {ScenarioState} from "../models/ScenarioState";

    export default {
        data() {
            return {
                list: null,
                scenarios: null,
                regionFilter: null,
                missedTreasuresFilter: null,
                stateFilter: null,
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
            if (this.list) {
                this.list.destroy();
            }
            this.$bus.$off('scenarios-updated', this.setScenarios);
        },
        computed: {
            filterEnabled() {
                return this.regionFilter || this.missedTreasuresFilter || this.stateFilter;
            }
        },
        methods: {
            setScenarios() {
                this.scenarios = app.scenarios;

                this.$nextTick(() => {
                    this.list = MDCList.attachTo(this.$refs['list']);
                    this.list.listen('MDCList:action', (event) => {
                        let id = $(event.target).find('li:eq(' + event.detail.index + ')').data('id');
                        this.open(this.scenarioRepository.find(id));
                    });
                });
            },
            open(scenario) {
                if (scenario.isVisible() || scenario.is_side) {
                    this.$bus.$emit('open-scenario', {
                        id: scenario.id
                    });
                }
            },
            applyFilter(scenario) {
                if (!this.regionFilter && !this.missedTreasuresFilter && !this.stateFilter) {
                    return true;
                } else if (this.regionFilter) {
                    return scenario.inRegion(this.regionFilter);
                } else if (this.stateFilter) {
                    return scenario.state === this.stateFilter;
                } else if (this.missedTreasuresFilter) {
                    return scenario.missedTreasures();
                }
            },
            setRegionFilter(id) {
                this.resetFilter();
                this.regionFilter = id;
            },
            setMissedTreasuresFilter() {
                this.resetFilter();
                this.missedTreasuresFilter = true;
            },
            setStateFilter(state) {
                this.resetFilter();
                this.stateFilter = state;
            },
            resetFilter() {
                this.regionFilter = null;
                this.missedTreasuresFilter = null;
                this.stateFilter = null;
            }
        }
    }
</script>
