<template>
    <inline-svg name="storyline" classes="h-screen"/>
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

                        if (scenario.isHidden()) {
                            $node.hide();
                        } else {
                            $node.show();
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
