<template>
    <div id="map-container" class="h-screen w-screen overflow-hidden">
        <webp src="/img/maps/background-lowres.jpg" :cover="true"
              highres="/img/maps/background-highres.jpg"
              alt="Gloomhaven map background" class="fixed"/>
        <div id="map" :style="{
                      'width': settings.width+'px',
                      'height': settings.height+'px'
                  }">
            <webp v-if="mapImages" :src="mapImages.lowres"
                  :highres="mapImages.highres"
                  alt="Gloomhaven map"
                  class="map"
                  :style="{
                      'top': '-' + settings.yOffset + 'px'
                  }"/>
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
                          :alt="$t(achievement.name)"/>
                </li>
            </ul>
            <template v-if="scenarios">
                <webp v-for="scenario in scenarios.items"
                      v-if="scenario.isVisible() && (!scenario.root || scenario.id === 1 || (scenario.root && scenario.isComplete())) && scenario.coordinates.x > 0 && scenario.coordinates.y > 0"
                      :src="scenario.image()"
                      :key="scenario.id"
                      :id="'s' + scenario.id"
                      :animate="true"
                      :alt="$t(scenario.name)"
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
            settings: {
                stickerScale: 1,
                yOffset: 0,
                width: 0,
                height: 0
            },
            mapTouch: null,
            scenarios: null,
            achievements: null,
            scenarioScale: 1,
            gameData: new GameData
        }
    },
    async mounted() {
        await this.loadMap();

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
        this.$bus.$on('game-selected', this.loadMap);
    },
    destroyed() {
        this.map?.dispose();
        this.$bus.$off('scenarios-updated', this.setScenarios);
        this.$bus.$off('windows-resized', this.setScenarios);
        if (this.mapTouch) {
            this.mapTouch.destroy();
        }
    },
    methods: {
        async loadMap() {
            this.mapImages = this.gameData.map(app.game);
            this.settings = this.gameData.mapSettings(app.game);

            await this.$nextTick();

            this.$map = document.getElementById('map');
            this.map?.dispose();
            this.map = panzoom(this.$map, {
                minZoom: this.scale(),
                maxZoom: 4,
                bounds: true
            });
            this.centerMap();
        },
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
                            content: scenario.number + ' ' + this.$t(scenario.name)
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
            const yOffset = this.settings.yOffset * scale;

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
            this.scenarioScale = this.settings.stickerScale;

            return this.isLandscape()
                ? window.innerHeight / this.settings.width
                : window.innerWidth / this.$map.offsetWidth;
        }
    }
}
</script>

<style lang="scss">
#map {
    position: relative;

    .map {
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
