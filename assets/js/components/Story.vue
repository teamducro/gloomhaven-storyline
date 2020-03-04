<template>
    <div class="h-screen w-screen">
        <inline-svg
                name="storyline"
                id="storyline"
                :classes="['h-screen', 'w-screen']"
        />
        <share></share>
        <reset></reset>
    </div>
</template>

<script>
    import zoom from "../services/Zoom";
    import {ScenarioState} from "../models/ScenarioState";
    import ScenarioRepository from "../repositories/ScenarioRepository";

    export default {
        data() {
            return {
                scenarioRepository: new ScenarioRepository()
            }
        },
        mounted() {
            this.render();
            this.$bus.$on('scenarios-updated', () => {
                this.render();
            });

            zoom('#storyline');

            $('.scenario').click((e) => {
                this.open($(e.currentTarget).data('id'));
            });
        },
        methods: {
            render() {
                if (app.scenarios) {
                    this.renderScenarios();
                    this.renderChapters();
                } else {
                    $('.scenario, .edge, .chapter').hide();
                }
            },
            renderScenarios() {
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
                            if (!scenario.choices) {
                                $edges.show();
                            } else if (scenario.choice) {
                                $('#edge' + scenario.id + '-' + scenario.choice).show();
                            }
                        }
                    }
                });
            },
            renderChapters() {
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((chapter_id) => {
                    let unlocked = app.scenarios.where('chapter_id', chapter_id).where('state', '!=', ScenarioState.hidden).count();
                    let $chapter = $('#chapter' + chapter_id);

                    if (unlocked) {
                        $chapter.show();
                    } else {
                        $chapter.hide();
                    }
                });
            },
            open(id) {
                this.$bus.$emit('open-scenario', {
                    id: id
                });
            }
        }
    }
</script>
