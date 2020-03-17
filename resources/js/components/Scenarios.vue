<template>
    <div class="pt-12 pb-4 px-4 flex justify-center w-full">

        <div class="fixed right-0 top-0 mt-1 z-5">
            <dropdown align="right">
                <template v-slot:trigger>
                    <button type="button" class="mdc-icon-button material-icons p-4">
                        filter_list
                    </button>
                </template>

                <ul class="mdc-list"
                    ref="filter" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                    <li class="mdc-list-item" @click="regionFilter = null">
                        <span class="mdc-list-item__text">All</span>
                    </li>
                    <li v-for="region in scenarioRepository.regions.items"
                        class="mdc-list-item" @click="regionFilter = region.id">
                        <span class="mdc-list-item__text">{{ region.name }}</span>
                    </li>
                </ul>
            </dropdown>
        </div>

        <ul v-if="scenarios" class="mdc-list bg-black2-25 p-2 rounded-lg mt-4" ref="list">
            <li v-for="scenario in scenarios.items"
                v-show="!regionFilter || (regionFilter && scenario.inRegion(regionFilter))"
                :key="scenario.id"
                class="mdc-list-item h-auto"
                :data-id="scenario.id"
                :tabindex="scenario.id">
                <template v-if="scenario.isVisible()">
                    <span class="mdc-list-item__text flex items-center">
                        <webp :src="'/img/scenarios/' + scenario.id + '.png'"
                              class="w-16 mr-4 my-1"
                              :alt="scenario.name"></webp>
                        <i v-if="scenario.isRequired() || scenario.isBlocked()"
                           class="material-icons text-incomplete text-2xl mr-2">highlight_off</i>
                        <i v-else-if="scenario.isComplete()"
                           class="material-icons text-complete text-2xl mr-2">check_circle_outline</i>
                        <i v-else
                           class="material-icons text-2xl mr-2">radio_button_unchecked</i>
                        {{ scenario.name }}
                    </span>
                </template>
                <template v-else>
                    <span class="mdc-list-item__text opacity-50 pl-28"
                          @click="open(scenario)">
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
    import Dropdown from "./Dropdown";

    export default {
        components: {Dropdown},
        data() {
            return {
                list: null,
                scenarios: null,
                regionFilter: null,
                filter: null,
                scenarioRepository: new ScenarioRepository()
            }
        },
        mounted() {
            if (app.scenarios) {
                this.setScenarios();
            }

            this.$bus.$on('scenarios-updated', () => {
                this.setScenarios();
            });
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
                if (scenario.isVisible()) {
                    this.$bus.$emit('open-scenario', {
                        id: scenario.id
                    });
                }
            }
        }
    }
</script>
