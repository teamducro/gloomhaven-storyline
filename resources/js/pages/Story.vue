<template>
    <div id="storyline-container" class="w-screen">
        <inline-svg
            v-if="storyline !== null && isPortrait !== null"
            :key="storylineKey"
            :src="storyline"
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
import GetCampaignName from "../services/GetCampaignName";

export default {
    mixins: [GetCampaignName],
    watch: {
        $route(to, from) {
            if (to.params.id) {
                this.open(to.params.id);
            }
        }
    },
    data() {
        return {
            isPortrait: null,
            zoom: null,
            storylineKey: 1,
            campaignName: null,
            storyline: null,
            scenarioRepository: new ScenarioRepository
        }
    },
    async mounted() {
        let id = parseInt(this.$route.params.id, 10);
        if (!isNaN(id)) {
            this.$bus.$emit('open-scenario', {id});
        }
        if (app.isPortrait !== undefined) {
            this.isPortrait = app.isPortrait;
            await this.$nextTick();
            this.rerender();
        }

        $('#storyline-container').on('click', '.scenario', this.scenarioClicked);
        this.$bus.$on('scenarios-updated', this.render);
        this.$bus.$on('orientation-changed', this.orientationChanged);
        this.$bus.$on('campaigns-changed', this.setCampaignName);

        this.setCampaignName();
    },
    destroyed() {
        if (this.zoom) {
            this.zoom.destroy();
        }
        $('#storyline-container').off('click', '.scenario', this.scenarioClicked);
        this.$bus.$off('scenarios-updated', this.render);
        this.$bus.$off('orientation-changed', this.orientationChanged);
        this.$bus.$off('campaigns-changed', this.setCampaignName);
    },
    methods: {
        render() {
            if (this.setStoryline()) {
                return this.rerender();
            }

            if (app.scenarios && this.isPortrait !== null) {
                this.renderScenarios();
                this.renderChapters();
                $('.campaign-name').text(this.campaignName);
            } else {
                $('.scenario, .edge, .chapter').hide();
                $('.legend .scenario').show();
            }
        },
        async rerender() {
            if (this.zoom) {
                this.zoom.destroy();
            }
            this.storylineKey++;
            await this.$nextTick();
            this.renderOrientation();
            this.render();
            this.zoom = await zoom('#storyline');
        },
        renderOrientation() {
            let viewBox = '';
            if (this.isPortrait) {
                viewBox = '0 -70 420 1080';
                $('#storyline .landscape').remove();
            } else {
                viewBox = '0 -40 610 700';
                $('#storyline .portrait').remove();
            }
            $('#storyline').attr('viewBox', viewBox);
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
                if (app.hasMouse && scenario.isVisible() && !$node.hasClass('has-tippy')) {
                    tippy($node[0], {
                        content: scenario.title
                    });
                    $node.addClass('has-tippy');
                }
            });
        },
        renderChapters() {
            for (let id = 1; id <= 16; id++) {
                const isSideChapter = id > 10;
                const scenariosInChapter = app.scenarios.where('chapter_id', id);
                let unlocked;

                if (isSideChapter) {
                    unlocked = scenariosInChapter
                        .where('state', '!=', ScenarioState.hidden)
                        .isNotEmpty()
                } else {
                    unlocked = scenariosInChapter
                        .where('state', '=', ScenarioState.complete)
                        .isNotEmpty() || id === 1;
                }

                if (unlocked) {
                    $('.chapter' + id).show();
                } else {
                    $('.chapter' + id).hide();
                }
            }
        },
        orientationChanged(isPortrait) {
            if (this.isPortrait !== isPortrait) {
                this.isPortrait = isPortrait;
                this.rerender();
            }
        },
        setCampaignName() {
            this.campaignName = this.getCampaignName();
            $('.campaign-name').text(this.campaignName);
        },
        setStoryline() {
            const storyline = 'storyline-' + app.game;
            if (this.storyline !== storyline) {
                this.storyline = storyline;
                return true;
            }
        },
        scenarioClicked(e) {
            let $node = $(e.currentTarget);
            if (!$node.attr('id')) {
                return;
            }
            let id = parseInt($(e.currentTarget).attr('id').replace('node', ''));
            this.open(id);
        },
        open(id) {
            this.$bus.$emit('open-scenario', {id});
        }
    }
}
</script>
