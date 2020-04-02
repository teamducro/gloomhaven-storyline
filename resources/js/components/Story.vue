<template>
    <div id="storyline-container" class="w-screen">
        <inline-svg
                v-if="isPortrait !== null"
                :key="storylineKey"
                :name="storylineFile"
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
                scenarioRepository: new ScenarioRepository(),
                isPortrait: null,
                zoom: null,
                storylineKey: 1
            }
        },
        mounted() {
            if (app.isPortrait !== undefined) {
                this.isPortrait = app.isPortrait;
                this.$nextTick(() => {
                    this.rerender();
                });
            }

            $('#storyline-container').on('click', '.scenario', this.scenarioClicked);
            this.$bus.$on('scenarios-updated', this.render);
            this.$bus.$on('orientation-changed', this.orientationChanged);
        },
        destroyed() {
            if (this.zoom) {
                this.zoom.destroy();
            }
            $('#storyline-container').off('click', '.scenario', this.scenarioClicked);
            this.$bus.$off('scenarios-updated', this.render);
            this.$bus.$off('orientation-changed', this.orientationChanged);
        },
        computed: {
            storylineFile() {
                return 'storyline-' + (this.isPortrait ? 'portrait' : 'landscape');
            }
        },
        methods: {
            render() {
                if (app.scenarios && this.isPortrait !== null) {
                    this.renderScenarios();
                    this.renderChapters();
                } else {
                    $('.scenario, .edge, .chapter').hide();
                }
            },
            rerender() {
                if (this.zoom) {
                    this.zoom.destroy();
                }
                this.storylineKey++;
                this.$nextTick(() => {
                    this.zoom = zoom('#storyline');
                    this.render();
                });
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
                        $node.removeClass(ScenarioState.states().join(' '));
                        if (scenario.isVisible()) {
                            $node.addClass(scenario.state);
                        }

                        if (scenario.is_side) {
                            if (scenario.isHidden()) {
                                $node.addClass('opacity-50');
                            } else {
                                $node.removeClass('opacity-50');
                            }
                        }

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
                    if (app.hasMouse && scenario.isVisible() && !$node.hasClass('tippy')) {
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
            orientationChanged(isPortrait) {
                if (this.isPortrait !== isPortrait) {
                    this.isPortrait = isPortrait;
                    this.rerender();
                }
            },
            scenarioClicked(e) {
                let id = parseInt($(e.currentTarget).attr('id').replace('node', ''));
                this.open(id);
            },
            open(id) {
                this.$bus.$emit('open-scenario', {
                    id: id
                });
            }
        }
    }
</script>
