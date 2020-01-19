<template>
    <div>
        <inline-svg name="storyline" classes="h-screen"/>
        <button type="button" @click="reset" class="mdc-button fixed right-0 bottom-0">
            <span class="mdc-button__label">Reset</span>
        </button>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
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
            reset() {
                localStorage.clear();
                app.fetchScenarios();
            }
        }
    }
</script>
