<template>
    <div id="map-container" class="h-screen w-screen overflow-hidden">
        <webp src="/img/maps/background-lowres.jpg" :cover="true"
              highres="/img/maps/background-highres.jpg"
              alt="Gloomhaven map background" class="fixed"/>
        <div id="map">
            <webp v-if="mapImages" :src="mapImages.lowres"
                  :highres="mapImages.highres"
                  alt="Gloomhaven map"
                  class="map"/>
            <ul v-if="achievements">
                <li v-for="achievement in achievements.items"
                    v-if="achievement.isGlobal() && achievement.awarded && !achievement.hidden"
                    :key="achievement.id"
                    class="absolute"
                    @click="openAchievement(achievement)"
                    :style="{
                        'top': '-174px',
                        'left': achievement.x + '%'
                    }">
                    <webp :src="achievement.image"
                          :animate="true" :retina="true"
                          class="cursor-pointer"
                          :alt="achievement.displayName"/>
                </li>
            </ul>
            <template v-if="scenarios">
                <webp v-for="scenario in scenarios.items"
                      v-if="scenario.isVisible() && (!scenario.root || scenario.id === 1 || (scenario.root && scenario.isComplete())) && scenario.coordinates.x > 0 && scenario.coordinates.y > 0"
                      :src="scenario.image()"
                      :key="scenario.id"
                      :id="'s' + scenario.id"
                      :animate="true"
                      :alt="scenario.name"
                      class="absolute scenario"
                      :style="{
                          'left': scenario.coordinates.x + '%',
                          'top': scenario.coordinates.y + '%',
                          'transform': 'scale('+scenarioScale+')'
                      }"/>
            </template>
        </div>
    </div>
</template>

<script>
import panzoom from "panzoom";
import Hammer from 'hammerjs';
import tippy from "tippy.js";
import GameData from "../services/GameData";

export default {
    data() {
        return {
            map: null,
            $map: null,
            mapImages: null,
            mapTouch: null,
            scenarios: null,
            achievements: null,
            scenarioScale: 1,
            gameData: new GameData
        }
    },
    mounted() {
        this.mapImages = this.gameData.map(app.game);

        this.$map = document.getElementById('map');
        this.map = panzoom(this.$map, {
            minZoom: this.scale(),
            maxZoom: 4,
            bounds: true
        });
        this.centerMap();

        if (app.scenarios) {
            this.setScenarios();
        }

        this.$bus.$on('scenarios-updated', this.setScenarios);
        this.$bus.$on('windows-resized', this.setScenarios);
        this.mapTouch = new Hammer(this.$map);
        this.mapTouch.on('tap', (e) => {
            if (e.target.id.startsWith('s')) {
                this.scenarioClicked(e);
            }
        });

        if (app.achievements) {
            this.setAchievements();
        }
        this.$bus.$on('achievements-updated', this.setAchievements);
    },
    destroyed() {
        if (this.map) {
            this.map.dispose();
        }
        this.$bus.$off('scenarios-updated', this.setScenarios);
        this.$bus.$off('windows-resized', this.setScenarios);
        if (this.mapTouch) {
            this.mapTouch.destroy();
        }
    },
    methods: {
        setScenarios() {
            this.mapImages = this.gameData.map(app.game);
            this.map.setMinZoom(this.scale());

            this.scenarios = app.scenarios;

            // Show tooltip on hover
            if (this.scenarios) {
                this.scenarios.each((scenario) => {
                    let s = document.getElementById('s' + scenario.id);
                    if (s && app.hasMouse && scenario.isVisible() && !s.classList.contains('tippy')) {
                        tippy(s, {
                            content: scenario.title
                        });
                        s.classList.add('tippy');
                    }
                });
            }
        },
        setAchievements() {
            this.achievements = app.achievements;
        },
        scenarioClicked(e) {
            let id = parseInt(e.target.id.replace('s', ''));
            this.open(id);
        },
        open(id) {
            this.$bus.$emit('open-scenario', {id});
        },
        openAchievement(achievement) {
            this.$bus.$emit('open-achievement', {
                id: achievement.id
            });
        },
        centerMap() {
            const scale = this.scale();
            this.map.zoomTo(0, 0, scale);
            const yOffset = 184 * scale;

            if (this.isLandscape()) {
                const mapWidth = this.$map.offsetWidth * scale;
                let x = (window.innerWidth - mapWidth) / 2;
                this.map.moveTo(x, yOffset + (20 / scale));
            } else {
                const mapHeight = this.$map.offsetHeight * scale;
                let y = (window.innerHeight - mapHeight) / 2;
                this.map.moveTo(0, y + yOffset);
            }
        },
        isLandscape() {
            return window.innerWidth > window.innerHeight;
        },
        scale() {
            this.scenarioScale = this.gameData.scenarioStickerScale(app.game);

            return this.isLandscape()
                ? window.innerHeight / 2155
                : window.innerWidth / this.$map.offsetWidth;
        }
    }
}
</script>

<style lang="scss">
#map {
    width: 2606px;
    height: 2155px;
    position: relative;

    .map {
        top: -184px;
        left: 0;
        width: 100%;
        position: absolute;
    }

    .scenario {
        &:hover {
            cursor: pointer;
        }
    }
}
</style>
