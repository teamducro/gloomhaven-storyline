<template>
    <div>
        <modal ref="modal">
            <template v-slot:body v-if="scenario">
                <h2 class="mdc-dialog__title" id="my-dialog-title">
                    {{ scenario.name }}
                    <button type="button" data-mdc-dialog-action="close"
                            class="mdc-button absolute right-0 top-0 mt-4">
                        <i class="material-icons">close</i>
                    </button>
                </h2>

                <div class="mdc-dialog__content" id="my-dialog-content">
                    <div class="mb-6 mt-4">
                        <radio id="incomplete" group="states" label="Incomplete"
                               :checked="scenario.isIncomplete()"
                               :disabled="scenario.isBlocked() || scenario.isRequired()"
                               @changed="stateChanged"
                        ></radio>
                        <radio id="complete" group="states" label="Complete"
                               :checked="scenario.isComplete()"
                               :disabled="scenario.isBlocked() || scenario.isRequired()"
                               @changed="stateChanged"
                        ></radio>
                    </div>

                    <div v-if="scenario.isBlocked()" class="mb-6">
                        This scenario is blocked by:
                        <span v-if="blockedScenarios.isEmpty()">???</span>
                        <a v-else v-for="blockedScenario in blockedScenarios"
                           role="button" class="link scenarios-links"
                           @click="open(blockedScenario.id)"
                           v-text="blockedScenario.name">
                        </a>
                    </div>

                    <div v-if="scenario.isRequired()" class="mb-6">
                        This scenario requires:
                        <span v-if="requiredScenarios.isEmpty()">???</span>
                        <a v-else v-for="requiredScenario in requiredScenarios"
                           role="button" class="link scenarios-links"
                           @click="open(requiredScenario.id)"
                           v-text="requiredScenario.name">
                        </a>
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
        <pages v-if="scenario" ref="pages" :pages="scenario.pages"></pages>
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
                this.scenarioRepository.changeState(this.scenario, state);

                window.bus.$emit('scenarios-updated');
            },
            noteChanged() {
                this.scenario.store();
            },
            openPages() {
                this.$refs['pages'].open();
            },
            open(id) {
                this.scenario = null;
                this.$nextTick(() => {
                    this.scenario = this.scenarioRepository.find(id);
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
