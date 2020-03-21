<template>
    <div class="w-screen">
        <inline-svg
                name="storyline"
                id="storyline"
                :classes="['h-screen', 'w-screen']"
        />
    </div>
</template>

<script>
    import zoom from "../services/Zoom";
    import {ScenarioState} from "../models/ScenarioState";
    import ScenarioRepository from "../repositories/ScenarioRepository";
    import tippy from 'tippy.js';

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

            $('.scenario').on('click', (e) => {
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

                    if (!$node.length) {
                        return;
                    }

                    let $edges = $('.edge' + scenario.id);
                    $edges.hide();

                    if (scenario.isHidden()) {
                        $node.hide();
                    }

                    if (scenario.isVisible() || scenario.is_side) {
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

                    // Show tooltip on hover
                    if (!$node.hasClass('tippy')) {
                        tippy($node[0], {
                            content: scenario.name
                        });
                        $node.addClass('tippy');
                    }
                });
            },
            renderChapters() {
                for (let id = 1; id <= 16; id++) {
                    let unlocked = app.scenarios.where('chapter_id', id).where('state', '!=', ScenarioState.hidden).count();
                    let $chapter = $('#chapter' + id);

                    if (unlocked) {
                        $chapter.show();
                    } else {
                        $chapter.hide();
                    }
                }
            },
            open(id) {
                this.$bus.$emit('open-scenario', {
                    id: id
                });
            }
        }
    }
</script>
