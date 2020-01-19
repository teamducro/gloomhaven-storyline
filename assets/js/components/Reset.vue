<template>
    <div>
        <button type="button" @click="open" class="mdc-button fixed right-0 bottom-0">
            <span class="mdc-button__label">Reset</span>
        </button>

        <modal ref="confirmReset" title="Remove">
            <template v-slot:content>
                <p>Are you sure you want to remove scenario data?</p>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__label">Cancel</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="resetStates">
                    <span class="mdc-button__label">Only states</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="reset">
                    <span class="mdc-button__label">Clear all</span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
    import ScenarioRepository from "../repositories/ScenarioRepository";

    export default {
        data() {
            return {
                scenarioRepository: new ScenarioRepository()
            }
        },
        methods: {
            open() {
                this.$refs['confirmReset'].open();
            },
            resetStates() {
                this.scenarioRepository.hideAllScenarios();

                window.bus.$emit('scenarios-updated');
            },
            reset() {
                localStorage.clear();
                app.fetchScenarios();
            }
        }
    }
</script>
