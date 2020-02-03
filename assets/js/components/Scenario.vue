<template>
    <div>
        <modal ref="modal">
            <template v-slot:body v-if="scenario">
                <div class="pl-6 border-b border-gray-300"
                     :class="{'pb-2': scenario.chapter, 'pb-4': !scenario.chapter}">
                    <h2 class="mdc-dialog__title p-0 leading-none">{{ scenario.name }}
                        <button type="button" data-mdc-dialog-action="close"
                                class="mdc-button absolute right-0 top-0 mt-4">
                            <i class="material-icons">close</i>
                        </button>
                    </h2>
                    <span v-if="scenario.chapter_name" class="text-xs uppercase text-gray-900 font-bold">{{ scenario.chapter_name }}</span>
                </div>

                <div class="mdc-dialog__content" id="my-dialog-content">
                    <div class="mb-6 mt-4">
                        <radio id="incomplete" group="states" label="Incomplete"
                               :key="'incomplete-' + stateKey"
                               :checked="scenario.isIncomplete()"
                               :disabled="scenario.isBlocked() || scenario.isRequired()"
                               @changed="stateChanged"
                        ></radio>
                        <radio id="complete" group="states" label="Complete"
                               :key="'complete-' + stateKey"
                               :checked="scenario.isComplete()"
                               :disabled="scenario.isBlocked() || scenario.isRequired()"
                               @changed="stateChanged"
                        ></radio>
                    </div>

                    <div v-if="scenario.requirments" class="mb-6 flex items-center">
                        <i v-if="scenario.isRequired() || scenario.isBlocked()"
                           class="material-icons text-incomplete text-2xl mr-1">highlight_off</i>
                        <i v-else class="material-icons text-complete text-2xl mr-1">check_circle_outline</i>
                        Requirments: {{ scenario.requirments }}
                    </div>

                    <div class="mb-6">
                        <div class="mdc-text-field mdc-text-field--textarea w-full"
                             ref="notes">
                                <textarea id="notes" @change="noteChanged" v-model="scenario.notes"
                                          class="mdc-text-field__input" rows="8" cols="40"></textarea>
                            <div class="mdc-notched-outline">
                                <div class="mdc-notched-outline__leading"></div>
                                <div class="mdc-notched-outline__notch">
                                    <label for="notes" class="mdc-floating-label">Notes</label>
                                </div>
                                <div class="mdc-notched-outline__trailing"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <button class="mdc-button mdc-button--raised" @click="openPages()">
                            <i class="material-icons mdc-button__icon">menu_book</i>
                            <span class="mdc-button__label">Pages</span>
                        </button>
                    </div>

                </div>
                <footer class="mdc-dialog__actions flex justify-between">
                    <div>
                        <button v-for="scenario in prevScenarios" type="button" class="mdc-button"
                                @click="open(scenario.id)">
                            <i class="material-icons">navigate_before</i>
                            <span class="mdc-button__label">{{ scenario.id }}</span>
                        </button>
                    </div>
                    <div>
                        <button v-for="scenario in nextScenarios" type="button" class="mdc-button"
                                @click="open(scenario.id)">
                            <span class="mdc-button__label">{{ scenario.id }}</span>
                            <i class="material-icons">navigate_next</i>
                        </button>
                    </div>
                </footer>
            </template>
        </modal>
        <pages v-if="scenario" ref="pages"
               :pages="scenario.pages"
        ></pages>
        <choose v-if="scenario && scenario.choices" ref="choose"
                :scenario-ids="scenario.choices"
                @scenario-chosen="scenarioChosen"
                @closing="chooseModalClosing"
        ></choose>
    </div>
</template>

<script>
    import ScenarioRepository from "../repositories/ScenarioRepository";
    import {MDCTextField} from "@material/textfield/component";
    import {ScenarioState} from "../models/ScenarioState";

    export default {
        data() {
            return {
                scenario: null,
                notes: null,
                stateKey: 1,
                scenarioRepository: new ScenarioRepository()
            }
        },
        mounted() {
            window.bus.$on('open-scenario', (data) => {
                this.open(data.id);
            });
        },
        computed: {
            blockedScenarios() {
                return this.scenarioRepository.findMany(this.scenario.blocked_by)
                    .where('state', ScenarioState.complete);
            },
            requiredScenarios() {
                return this.scenarioRepository.findMany(this.scenario.required_by)
                    .where('state', ScenarioState.incomplete);
            },
            prevScenarios() {
                return this.scenarioRepository.findMany(this.scenario.linked_from)
                    .where('state', ScenarioState.complete);
            },
            nextScenarios() {
                if (this.scenario.isComplete()) {
                    return this.scenarioRepository.findMany(this.scenario.links_to)
                        .where('state', '!=', ScenarioState.hidden);
                } else {
                    return null;
                }
            }
        },
        methods: {
            stateChanged(state) {
                if (state === ScenarioState.complete && this.scenario.choices) {
                    this.$refs['choose'].open();
                } else {
                    this.scenarioRepository.changeState(this.scenario, state);
                }

                window.bus.$emit('scenarios-updated');
            },
            noteChanged() {
                this.scenario.store();
            },
            scenarioChosen(choice) {
                this.scenarioRepository.choose(this.scenario, choice);

                window.bus.$emit('scenarios-updated');
            },
            chooseModalClosing(action) {
                if (action !== 'chosen') {
                    this.rerenderStateSelection();
                }
            },
            openPages() {
                this.$refs['pages'].open();
            },
            rerenderStateSelection() {
                this.stateKey++;
            },
            open(id) {
                this.scenario = this.scenarioRepository.find(id);
                this.rerenderStateSelection();
                this.$nextTick(() => {
                    this.$refs['modal'].open();
                    this.$nextTick(() => {
                        new MDCTextField(this.$refs['notes']);
                    });
                });
            }
        }
    }
</script>

<style lang="scss">
    .mdc-notched-outline__notch {
        border-right: none;
        border-left: none;
    }

    .scenarios-links + .scenarios-links {
        &:before {
            content: '/ ';
        }
    }
</style>
