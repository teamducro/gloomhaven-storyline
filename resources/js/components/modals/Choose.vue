<template>
    <div>
        <modal ref="modal" title="Choose a scenario to unlock">
            <template v-slot:content>
                <div class="flex flex-col">
                    <radio v-for="scenario in scenarios"
                           :id="'choose-scenario' + scenario.id"
                           :key="scenario.id"
                           :label="scenario.name"
                           group="choose"
                           @changed="selected = scenario"
                    ></radio>
                </div>
            </template>
            <template v-slot:buttons>
                <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
                    <span class="mdc-button__label">Cancel</span>
                </button>
                <button :disabled="!selected"
                        class="mdc-button mdc-dialog__button mdc-button--raised"
                        data-mdc-dialog-action="chosen"
                        @click="scenarioChosen(selected)">
                    <span class="mdc-button__label">Choose</span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
    import ScenarioRepository from "../../repositories/ScenarioRepository";

    export default {
        props: {
            scenarioIds: Array
        },
        data() {
            return {
                scenarios: [],
                selected: null,
                scenarioRepository: new ScenarioRepository()
            }
        },
        mounted() {
            this.scenarios = this.scenarioRepository.findMany(this.scenarioIds);
            this.$refs['modal'].$on('closing', (event) => {
                this.$emit('closing', event.detail.action);
            });
            this.$refs['modal'].$on('closed', (event) => {
                this.$emit('closed', event.detail.action);
            });
        },
        methods: {
            open() {
                this.$refs['modal'].open();
            },
            scenarioChosen(scenario) {
                this.$emit('scenario-chosen', scenario);
            }
        }
    }
</script>
