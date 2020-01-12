<template>
    <div class="mdc-dialog scenario-modal"
         aria-modal="true">
        <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface">
                <template v-if="scenario">
                    <h2 class="mdc-dialog__title" id="my-dialog-title">
                        {{ scenario.name }}
                    </h2>
                    <div class="mdc-dialog__content" id="my-dialog-content">

                        <radio id="hidden" group="states" label="Hidden"
                               :checked="scenario.isHidden()"
                               @changed="stateChanged"></radio>
                        <radio id="incomplete" group="states" label="Incomplete"
                               :checked="scenario.isIncomplete()"
                               @changed="stateChanged"></radio>
                        <radio id="complete" group="states" label="Complete"
                               :checked="scenario.isComplete()"
                               @changed="stateChanged"></radio>

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

    export default {
        data() {
            return {
                scenario: null,
                modal: null
            }
        },
        mounted() {
            window.bus.$on('open-scenario', (data) => {
                this.open(data.id);
            });

            this.modal = new MDCDialog(document.querySelector('.scenario-modal'));
        },
        methods: {
            stateChanged(state) {
                this.scenario.status = state;
                this.scenario.store();
                // window.bus.$emit('scenarios-updated');
            },
            open(id) {
                this.scenario = app.scenarios.firstWhere('id', id);
                this.modal.open();
            }
        }
    }
</script>
