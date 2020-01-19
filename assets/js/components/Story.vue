<template>
    <div>
        <inline-svg name="storyline" classes="h-screen"/>
        <button type="button" @click="openReset" class="mdc-button fixed right-0 bottom-0">
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
        mounted() {
            this.render();
            window.bus.$on('scenarios-updated', () => {
                this.render();
            });

            $('.scenario').click((e) => {
                this.open($(e.currentTarget).data('id'));
            });
        },
        methods: {
            render() {
                if (app.scenarios) {
                    app.scenarios.each((scenario) => {
                        let $node = $('#node' + scenario.id);
                        let $edges = $('.edge' + scenario.id);
                        $edges.hide();

                        if (scenario.isHidden()) {
                            $node.hide();
                        } else {
                            $node.show();
                            $node.attr('stroke-width', scenario.isComplete() ? 2 : 1);

                            if (scenario.isBlocked()) {
                                $node.find('.blocked').show();
                            } else {
                                $node.find('.blocked').hide();
                            }

                            if (scenario.isRequired()) {
                                $node.find('.required').show();
                            } else {
                                $node.find('.required').hide();
                            }

                            if (scenario.isComplete()) {
                                $edges.show();
                            }
                        }
                    });
                } else {
                    $('.scenario, .edge').hide();
                }
            },
            open(id) {
                window.bus.$emit('open-scenario', {
                    id: id
                });
            },
            openReset() {
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
