<template>
    <modal ref="modal">
        <template v-slot:body v-if="scenario">
            <span class="absolute right-0 top-0 p-2 rounded-bl-lg bg-gray-300 uppercase font-bold text-xs">{{ scenario.state }}</span>
            <h2 class="mdc-dialog__title" id="my-dialog-title">
                {{ scenario.name }}
            </h2>
            <div class="mdc-dialog__content" id="my-dialog-content">

                <div class="mb-6">
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

            </div>
            <footer class="mdc-dialog__actions">
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__label">Close</span>
                </button>
            </footer>
        </template>
    </modal>
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
