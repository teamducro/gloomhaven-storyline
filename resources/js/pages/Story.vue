<template>
    <div id="storyline-container" class="w-screen" ref="storyline-container">
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

        if (this.$refs['storyline-container']) {
            this.$refs['storyline-container'].addEventListener('click', this.scenarioClicked, false);
        }
        this.$bus.$on('scenarios-updated', this.render);
        this.$bus.$on('orientation-changed', this.orientationChanged);
        this.$bus.$on('campaigns-changed', this.setCampaignName);

        this.setCampaignName();
    },
    destroyed() {
        if (this.zoom) {
            this.zoom.destroy();
        }
        if (this.$refs['storyline-container']) {
            this.$refs['storyline-container'].removeEventListener('click', this.scenarioClicked, false);
        }
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
                [...document.getElementsByClassName('campaign-name')].forEach((element) => {
                    element.innerHTML = this.campaignName;
                });
            } else {
                [...document.querySelectorAll('.scenario, .edge, .chapter')].forEach((element) => {
                    element.style.display = 'none';
                });
                [...document.querySelectorAll('.legend .scenario')].forEach((element) => {
                    element.style.display = 'inline';
                });
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
                [...document.querySelectorAll('#storyline .landscape')].forEach((element) => {
                    element.remove();
                });
            } else {
                viewBox = '0 -40 610 700';
                [...document.querySelectorAll('#storyline .portrait')].forEach((element) => {
                    element.remove();
                });
            }
            const storyline = document.getElementById('storyline')
            if (storyline) {
                storyline.setAttribute('viewBox', viewBox);
            }
        },
        renderScenarios() {
            app.scenarios.each((scenario) => {
                let node = document.getElementById('node' + scenario.id);

                if (!node) {
                    return;
                }

                let edges = document.getElementsByClassName('edge' + scenario.id);
                [...edges].forEach((element) => {
                    element.style.display = 'none';
                });

                if (scenario.isHidden()) {
                    node.style.display = 'none';
                }

                if (scenario.isVisible() || scenario.is_side) {
                    node.style.display = 'inline';
                    ScenarioState.states().forEach((state) => {
                        node.classList.remove(state);
                    })
                    if (scenario.isVisible()) {
                        node.classList.add(scenario.state);
                    }

                    if (scenario.is_side) {
                        if (scenario.isHidden()) {
                            node.classList.add('opacity-50');
                        } else {
                            node.classList.remove('opacity-50');
                        }
                    }

                    const blocked = node.getElementsByClassName('blocked');
                    if (blocked.length) {
                        if (scenario.isBlocked()) {
                            blocked[0].style.display = 'inline';
                        } else {
                            blocked[0].style.display = 'none';
                        }
                    }

                    const required = node.getElementsByClassName('required');
                    if (required.length) {
                        if (scenario.isRequired()) {
                            required[0].style.display = 'inline';
                        } else {
                            required[0].style.display = 'none';
                        }
                    }

                    if (scenario.isComplete()) {
                        if (!scenario.choices && !scenario.treasures_to.isNotEmpty()) {
                            [...edges].forEach((element) => {
                                element.style.display = 'inline';
                            });
                        }

                        if (scenario.choice) {
                            String(scenario.choice).split(',').forEach((c) => {
                                let edge = document.getElementById('edge' + scenario.id + '-' + c);
                                if (edge) {
                                    edge.style.display = 'inline';
                                }
                            });
                        }

                        if (scenario.treasures_to.isNotEmpty()) {
                            scenario.links_to.each((id) => {
                                let edge = document.getElementById('edge' + scenario.id + '-' + id);
                                if (edge) {
                                    edge.style.display = 'inline';
                                }
                            });
                            this.scenarioRepository.unlockedByTreasureScenarios(scenario).each((t) => {
                                let edge = document.getElementById('edge' + scenario.id + '-' + t.id);
                                if (edge) {
                                    edge.style.display = 'inline';
                                }
                            });
                        }
                    }
                }

                // Show tooltip on hover
                if (app.hasMouse && scenario.isVisible() && !node.classList.contains('has-tippy')) {
                    tippy(node, {
                        content: scenario.title
                    });
                    node.classList.add('has-tippy');
                }
            });
        },
        renderChapters() {
            [...document.getElementsByClassName('chapter')].forEach((chapter) => {
                if (chapter.classList.contains('intro')) {
                    chapter.style.display = 'inline';
                    return;
                }

                const id = parseInt(chapter.id.replace('chapter', '').trim());
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
                    chapter.style.display = 'inline';
                } else {
                    chapter.style.display = 'none';
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
            [...document.getElementsByClassName('campaign-name')].forEach((element) => {
                element.innerHTML = this.campaignName;
            });
        },
        setStoryline() {
            const storyline = 'storyline-' + app.game;
            if (this.storyline !== storyline) {
                this.storyline = storyline;
                return true;
            }
        },
        scenarioClicked(e) {
            let node = e.target;

            while (node && !node.classList.contains('scenario') && node !== e.currentTarget) {
                node = node.parentNode
            }

            if (node.classList.contains('scenario') && node.id) {
                const id = parseInt(node.id.replace('node', ''));
                this.open(id);
            }
        },
        open(id) {
            this.$bus.$emit('open-scenario', {id});
        }
    }
}
</script>
