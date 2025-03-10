<template>
    <div id="map-container" :key="'map-'+game" class="h-screen w-screen overflow-hidden">
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
                      'top': '-'+settings.yOffset+'px'
                  }"/>
            <ul v-if="achievements && achievements.count()">
                <li v-for="achievement in achievements.items"
                    v-if="achievement.isGlobal() && achievement.awarded && !achievement.hidden"
                    :key="game+'-'+achievement.id"
                    class="absolute"
                    :style="{
                        'top': '-174px',
                        'left': achievement.x + '%'
                    }">
                    <webp :src="achievement.image"
                          :animate="true" :retina="true"
                          class="cursor-pointer"
                          :id="'a' + achievement.id"
                          :alt="$t(achievement.name)"/>
                </li>
            </ul>

            <webp v-for="overlay in overlays"
                  :src="'/img/overlays/'+game+'/'+overlay.id+'.png'"
                  :key="game+'-'+overlay.id"
                  :id="'o' + overlay.id"
                  :animate="true"
                  :alt="$t(overlay.id)"
                  class="absolute"
                  :style="{
                      'left': overlay.coordinates.x + '%',
                      'top': overlay.coordinates.y + '%',
                      'transform': 'scale('+scenarioScale+')'
                  }"/>

            <template v-if="scenarios && scenarios.isNotEmpty()">
                <webp v-for="scenario in scenarios.items.filter(filteredScenarios)"
                      :src="scenario.image()"
                      :key="game+'-'+scenario.id"
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
            
            <template v-if="buildings && buildings.isNotEmpty()">
                <webp v-for="building in buildings.items.filter(filteredBuildings)"
                      :src="building.image()"
                      :key="game+'-b'+building.id"
                      :id="'b' + building.id"
                      :animate="true"
                      :alt="$t(building.name)"
                      class="absolute"
                      :class="[building.isActive() ? 'scenario' : '']"
                      :style="{
                          'left': building.coordinates.x + '%',
                          'top': building.coordinates.y + '%',
                          'transform': 'scale('+scenarioScale+')'
                      }"/>
            </template>

            <p v-if="game === Game.fh && overlays && overlays.contains('id','A')"
                class="absolute text-center text-gray-800 font-title text-xs"
                style="left: 69.8%; top: 85.05%; width: 165px;">{{ overlays.where('id','A').first().name }}</p>
        </div>
    </div>
</template>

<script>
import panzoom from "panzoom";
import Hammer from 'hammerjs';
import tippy from "tippy.js";
import GameData from "../services/GameData";
import {Game} from "../models/Game";

export default {
    computed: {
        Game() {
            return Game
        }
    },
    inject: ['appData'],
    data() {
        return {
            game: 'gh',
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
            overlays: null,
            buildings: null,
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

        if (app.achievements) {
            this.setAchievements();
        }
        this.$bus.$on('achievements-updated', this.setAchievements);
        this.$bus.$on('game-selected', this.loadMap);
        
        if (app.overlays) {
            this.setOverlays();
        }
        if (app.buildings) {
            this.setBuildings();
        }
        this.$bus.$on('buildings-updated', this.setBuildings);
        this.$bus.$on('overlays-updated', this.setOverlays);
    },
    destroyed() {
        this.map?.dispose();
        this.$bus.$off('scenarios-updated', this.setScenarios);
        this.$bus.$off('windows-resized', this.setScenarios);
        this.$bus.$off('achievements-updated', this.setAchievements);
        this.$bus.$off('game-selected', this.loadMap);
        this.$bus.$off('buildings-updated', this.setBuildings);
        this.$bus.$off('overlays-updated', this.setOverlays);
        if (this.mapTouch) {
            this.mapTouch.destroy();
        }
    },
    methods: {
        async loadMap(game) {
            this.game = game || this.appData.game;
            this.mapImages = this.gameData.map(this.game);
            this.settings = this.gameData.mapSettings(this.game);

            await this.$nextTick();

            this.$map = document.getElementById('map');
            this.map?.dispose();
            this.map = panzoom(this.$map, {
                minZoom: this.scale(),
                maxZoom: 4,
                bounds: true
            });
            this.centerMap();

            // Register touch events
            if (this.mapTouch) {
                this.mapTouch.destroy();
            }
            this.mapTouch = new Hammer(this.$map);
            this.mapTouch.on('tap', (e) => {
                if (e.target.id.startsWith('s')) {
                    this.scenarioClicked(e);
                }
                else if (e.target.id.startsWith('a')) {
                    this.achievementClicked(e);
                }
                else if (e.target.id.startsWith('b') && e.target.classList.contains('scenario')) {
                    this.buildingClicked(e);
                }
            });
        },
        setScenarios() {
            this.mapImages = this.gameData.map(this.game);

            // Games that do not support a map view, for example: CS
            if (this.mapImages === null) {
                this.$router.replace('/');
            }

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
        setBuildings() {
            this.buildings = app.buildings;
        },
        setOverlays() {
            this.overlays = app.overlays.filter(overlay => overlay.present);
        },
        scenarioClicked(e) {
            let id = parseInt(e.target.id.replace('s', ''));
            this.open(id);
        },
        achievementClicked(e) {
            let id = e.target.id.substring(1);
            this.openAchievement(id);
        },
        buildingClicked(e) {
            let id = parseInt(e.target.id.replace('b', ''));
            this.openBuilding(id);
        },
        open(id) {
            this.$bus.$emit('open-scenario', {id});
        },
        openAchievement(id) {
            this.$bus.$emit('open-achievement', {id});
        },
        openBuilding(id) {
            this.$bus.$emit('open-building-card', {id});
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
        },
        filteredScenarios(scenario) {
            return scenario.isVisible()
                && (!scenario.root || scenario.id === 1 || (scenario.root && scenario.isComplete()))
                && scenario.coordinates.x > 0
                && scenario.coordinates.y > 0;
        },
        filteredBuildings(building) {
            // Building 42 should be hidden if scenario 64 is active
            if (this.game === Game.fh && building.id === 42) {
                let blocker = this.scenarios.items.find(s => s.id === 64);
                if (blocker.isVisible() && !blocker.isComplete()) {
                    return false;
                }
            }

            return building.isUnlocked()
                && building.coordinates.x > 0
                && building.coordinates.y > 0;
        },
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
