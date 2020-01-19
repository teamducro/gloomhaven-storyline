<template>
    <div class="mdc-dialog" ref="modal" aria-modal="true">
        <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface">
                <template v-if="scenario">
                    <h2 class="mdc-dialog__title" id="my-dialog-title">
                        {{ scenario.name }} | {{ scenario.state }}
                    </h2>
                    <div class="mdc-dialog__content" id="my-dialog-content">

                        <div class="mb-8">
                            <radio id="incomplete" group="states" label="Incomplete"
                                   :checked="scenario.isIncomplete()"
                                   @changed="stateChanged"></radio>
                            <radio id="complete" group="states" label="Complete"
                                   :checked="scenario.isComplete()"
                                   @changed="stateChanged"></radio>
                        </div>

                        <div class="mb-8">
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
            </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
    </div>
</template>

<script>
    import {MDCDialog} from '@material/dialog';
    import ScenarioRepository from "../repositories/ScenarioRepository";
    import {MDCTextField} from "@material/textfield/component";
    import ScenarioValidator from "../services/ScenarioValidator";

    export default {
        data() {
            return {
                scenario: null,
                modal: null,
                notes: null,
                scenarioRepository: new ScenarioRepository(),
                scenarioValidator: new ScenarioValidator()
            }
        },
        mounted() {
            window.bus.$on('open-scenario', (data) => {
                this.open(data.id);
            });

            this.modal = new MDCDialog(this.$refs['modal']);
        },
        methods: {
            stateChanged(state) {
                this.scenarioValidator.changeState(this.scenario, state);

                window.bus.$emit('scenarios-updated');
            },
            noteChanged() {
                this.scenario.store();
            },
            open(id) {
                this.scenario = null;
                this.$nextTick(() => {
                    this.scenario = this.scenarioRepository.find(id);
                    this.modal.open();
                    this.$nextTick(() => {
                        new MDCTextField(this.$refs['notes']);
                    });
                });
            }
        }
    }
</script>

<style>
    .mdc-notched-outline__notch {
        border-right: none;
        border-left: none;
    }
</style>
