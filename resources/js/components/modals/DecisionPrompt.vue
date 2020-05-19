<template>
    <div>
        <modal ref="modal" :title="$t(config.title)">
            <template v-slot:content>
                <div class="flex flex-col mb-4">
                    {{ $t(config.text) }}
                </div>
                <div class="flex flex-col">
                    <radio v-for="option in config.options"
                           :id="option.id"
                           :key="option.value"
                           :label="$t(option.text)"
                           group="choose"
                           @changed="selected = option.value"
                    ></radio>
                </div>
            </template>
            <template v-slot:buttons>
                <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
                    <span class="mdc-button__label">Cancel</span>
                </button>
                <button :disabled="selected === undefined"
                        class="mdc-button mdc-dialog__button mdc-button--raised"
                        data-mdc-dialog-action="chosen"
                        @click="onChoose(selected)">
                    <span class="mdc-button__label">Choose</span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>

    import PromptConfig from "../../models/PromptConfig";
    import ChoiceService from "../../services/ChoiceService";
    import ScenarioRepository from "../../repositories/ScenarioRepository";

    export default {
        props: {
            config: {
                type: PromptConfig,
                default: () => new PromptConfig
            }
        },
        data() {
            return {
                selected: undefined,
                choiceService: new ChoiceService(),
                scenarioRepository: new ScenarioRepository()
            }
        },
        mounted() {
            this.togglePrompt(this.config.show);
            this.$bus.$on('open-scenario', (data) => {
                this.togglePrompt(this.config.show);
            });
            this.$refs['modal'].$on('closing', (event) => {
                this.$emit('closing', event.detail.action || "chosen");
            });
        },
        watch: {
            config: function (newVal, oldVal) {
                this.togglePrompt(newVal.show || false);
            }
        },

        methods: {
            togglePrompt(value) {
                if (value) {
                    this.$refs['modal'].open();
                } else {
                    this.$refs['modal'].close();
                }
            },
            onChoose(selected) {
                this.config.callback(selected);
                selected = null;
                this.scenarioRepository.scenarioValidator.validate();
                this.$bus.$emit('scenarios-updated');
                this.$bus.$emit('achievements-updated');
            }
        }
    }
</script>
