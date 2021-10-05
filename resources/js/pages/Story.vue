<template>
    <div id="storyline-container" class="w-screen">
        <inline-svg
            v-if="storyline !== null && isPortrait !== null"
            :key="storylineKey"
            :src="'storylines/'+storyline"
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
import GameData from "../services/GameData";

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
            game: null,
            storylineKey: 1,
            campaignName: null,
            storyline: null,
            scenarioRepository: new ScenarioRepository,
            gameData: new GameData
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

        c('#storyline-container').on('click', '.scenario', this.scenarioClicked);
        this.$bus.$on('scenarios-updated', this.render);
        this.$bus.$on('orientation-changed', this.orientationChanged);
        this.$bus.$on('campaigns-changed', this.setCampaignName);

        this.setCampaignName();
    },
    destroyed() {
        this.removeZoom();
        c('#storyline-container').off('click', '.scenario', this.scenarioClicked);
        this.$bus.$off('scenarios-updated', this.render);
        this.$bus.$off('orientation-changed', this.orientationChanged);
        this.$bus.$off('campaigns-changed', this.setCampaignName);
    },
    methods: {
        render() {
            this.game = app.game;

            if (this.setStoryline()) {
                return this.rerender();
            }

            if (app.scenarios && this.isPortrait !== null) {
                this.renderScenarios();
                this.renderChapters();
                c('.campaign-name').text(this.campaignName);
            } else {
                c('.scenario, .edge, .chapter').hide();
                c('.legend .scenario').show();
            }
        },
        async rerender() {
            this.removeZoom();
            this.storylineKey++;
            await this.$nextTick();
            this.renderOrientation();
            this.render();
            this.zoom = await zoom('#storyline');
        },
        renderOrientation() {
            const viewBoxes = this.gameData.storylineViewBox(app.game);

            if (this.isPortrait) {
                c('#storyline .landscape').remove();
                c('#storyline').attr('viewBox', viewBoxes.portrait);
            } else {
                c('#storyline .portrait').remove();
                c('#storyline').attr('viewBox', viewBoxes.landscape);
            }
        },
        renderScenarios() {
            app.scenarios.each((scenario) => {
                let $node = c('#node' + scenario.id);

                if (!$node.length) {
                    return;
                }

                let $edges = c('.edge' + scenario.id);
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
                        if (!scenario.choices && !scenario.treasures_to.isNotEmpty()) {
                            $edges.show();
                        }

                        if (scenario.choice) {
                            String(scenario.choice).split(',').forEach((choice) => {
                                c('#edge' + scenario.id + '-' + choice).show();
                            });
                        }

                        if (scenario.treasures_to.isNotEmpty()) {
                            scenario.links_to.each((id) => {
                                c('#edge' + scenario.id + '-' + id).show();
                            });
                            this.scenarioRepository.unlockedByTreasureScenarios(scenario).each((treasure) => {
                                c('#edge' + scenario.id + '-' + treasure.id).show();
                            });
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
            c('.chapter').each((index, element) => {
                if (element.classList.contains('intro')) {
                    c(element).show();
                    return;
                }

                let id = parseInt(element.id.replace('chapter', '').trim());

                const isSideChapter = id > 99;
                const scenariosInChapter = app.scenarios.where('chapter_id', id);
                let unlocked;

                if (isSideChapter) {
                    unlocked = scenariosInChapter
                        .where('state', '!=', ScenarioState.hidden)
                        .isNotEmpty()
                } else {
                    unlocked = scenariosInChapter
                        .where('state', '=', ScenarioState.complete)
                        .isNotEmpty();
                }

                if (unlocked) {
                    c(element).show();
                } else {
                    c(element).hide();
                }
            });
        },
        orientationChanged(isPortrait) {
            if (this.isPortrait !== isPortrait) {
                this.isPortrait = isPortrait;
                this.rerender();
            }
        },
        setCampaignName() {
            this.campaignName = this.getCampaignName();
            c('.campaign-name').text(this.campaignName);
        },
        setStoryline() {
            if (this.storyline !== app.game) {
                this.storyline = app.game;
                return true;
            }
        },
        removeZoom() {
            if (this.zoom) {
                try {
                    this.zoom.destroy();
                } catch (e) {
                }
            }
        },
        scenarioClicked(e) {
            let $node = c(e.currentTarget);
            if (!$node.attr('id')) {
                return;
            }
            let id = parseInt(c(e.currentTarget).attr('id').replace('node', ''));
            this.open(id);
        },
        open(id) {
            this.$bus.$emit('open-scenario', {id});
        }
    }
}
</script>
