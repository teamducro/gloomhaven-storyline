<template>
    <div id="map-container" class="h-screen w-screen overflow-hidden">
        <webp src="/img/map-background-lowres.jpg" :cover="true"
              highres="/img/map-background-highres.jpg"
              alt="Gloomhaven map background" class="fixed"/>
        <div id="map">
            <webp src="/img/map-lowres.gif"
                  highres="/img/map-highres.png"
                  alt="Gloomhaven map"
                  class="w-full h-full"/>
            <template v-if="scenarios">
                <webp v-for="scenario in scenarios.items"
                      v-if="scenario.isVisible()"
                      :src="scenario.image()"
                      :key="scenario.id"
                      :id="'s' + scenario.id"
                      :animate="true"
                      :alt="scenario.name"
                      class="absolute scenario"
                      :style="{
                          'left': scenario.coordinates.x + '%',
                          'top': scenario.coordinates.y + '%',
                      }"/>
            </template>
        </div>
    </div>
</template>

<script>
    import panzoom from "panzoom";
    import tippy from "tippy.js";

    export default {
        data() {
            return {
                map: null,
                mapTouch: null,
                scenarios: null,
                scale: 0.79
            }
        },
        mounted() {
            this.setScale();
            this.map = panzoom(document.querySelector('#map'), {
                minZoom: this.scale,
                maxZoom: 4,
                bounds: true
            });
            this.map.zoomTo(0, 0, this.scale);

            if (app.scenarios) {
                this.setScenarios();
            }

            this.$bus.$on('scenarios-updated', this.setScenarios);
            this.$bus.$on('windows-resized', this.setScenarios);
            $('#map').on('click', '.scenario', this.scenarioClicked);
            this.mapTouch = new Hammer(document.getElementById('map'));
            this.mapTouch.on('tap', (e) => {
                if (e.target.id.startsWith('s')) {
                    this.scenarioClicked(e);
                }
            });
        },
        destroyed() {
            if (this.map) {
                this.map.dispose();
            }
            this.$bus.$off('scenarios-updated', this.setScenarios);
            this.$bus.$off('windows-resized', this.setScenarios);
            $('#map').off('click', '.scenario', this.scenarioClicked);
            this.mapTouch.destroy();
        },
        methods: {
            setScale() {
                this.scale = $(window).width() / 2484;
            },
            setScenarios() {
                this.setScale();
                this.map.setMinZoom(this.scale);

                this.scenarios = app.scenarios;

                // Show tooltip on hover
                this.scenarios.each((scenario) => {
                    let $s = $('#s' + scenario.id);
                    if (app.hasMouse && scenario.isVisible() && !$s.hasClass('tippy')) {
                        tippy($s[0], {
                            content: scenario.title
                        });
                        $s.addClass('tippy');
                    }
                });
            },
            scenarioClicked(e) {
                let id = parseInt(e.target.id.replace('s', ''));
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

<style lang="scss">
    #map {
        width: 2484px;
        height: 2160px;

        .scenario {
            transform: scale(0.79);

            &:hover {
                cursor: pointer;
            }
        }
    }
</style>
