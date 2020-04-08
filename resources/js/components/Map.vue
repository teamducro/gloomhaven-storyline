<template>
    <div id="map-container" class="h-screen w-screen overflow-hidden">
        <div id="map">
            <webp :src="mapImage" alt="Gloomhaven map" class="w-full h-full"/>
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
    import PreloadImage from "../services/PreloadImage";

    export default {
        data() {
            return {
                map: null,
                mapImage: '/img/map-lowres.jpg',
                highres: '/img/map-highres.jpg',
                scenarios: null,
                scale: 0.79,
                stickers: collect(),
                preloadImage: new PreloadImage()
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

            this.$nextTick(() => {
                this.preloadImage.handle(this.highres, () => {
                    this.mapImage = this.highres;
                });
            });
        },
        destroyed() {
            if (this.map) {
                this.map.dispose();
            }
            this.$bus.$off('scenarios-updated', this.setScenarios);
            this.$bus.$off('windows-resized', this.setScenarios);
            $('#map').off('click', '.scenario', this.scenarioClicked);
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
                let id = parseInt($(e.currentTarget).attr('id').replace('s', ''));
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
