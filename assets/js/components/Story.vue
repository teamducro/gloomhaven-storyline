<template>
    <div class="h-screen w-screen">
        <inline-svg
                name="storyline"
                id="storyline"
                :classes="['h-screen', 'w-screen']"
        />
        <reset></reset>
    </div>
</template>

<script>
    import svgPanZoom from 'svg-pan-zoom'

    export default {
        data() {
            return {}
        },
        mounted() {
            this.render();
            window.bus.$on('scenarios-updated', () => {
                this.render();
            });

            let instance = svgPanZoom('#storyline');

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
            }
        }
    }
</script>
