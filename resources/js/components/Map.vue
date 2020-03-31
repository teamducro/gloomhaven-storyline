<template>
    <div id="map">
        <webp src="/img/map.jpg" alt="Gloomhaven map"></webp>
        <template v-if="scenarios">
            <webp v-for="scenario in scenarios.items"
                  v-if="scenario.isVisible()"
                  :src="scenario.image()"
                  :key="scenario.id"
                  :id="'s' + scenario.id"
                  :animate="true"
                  class="absolute scenario"
                  :style="{
                      'left': scenario.coordinates.x + '%',
                      'top': scenario.coordinates.y + '%',
                      'transform': 'scale('+scale+')',
                      'padding-top': scale*2+'%',
                      'padding-left': scale*2+'%'
                  }"
                  :alt="scenario.name"></webp>
        </template>
    </div>
</template>

<script>
    import panzoom from "panzoom";
    import tippy from "tippy.js";

    export default {
        data() {
            return {
                map: null,
                scenarios: null,
                factor: 1,
                scale: 0.79
            }
        },
        mounted() {
            this.map = panzoom(document.querySelector('#map'), {
                minZoom: 1,
                maxZoom: 6,
                bounds: true
            });

            if (app.scenarios) {
                this.setScenarios();
            }

            this.$bus.$on('scenarios-updated', this.setScenarios);
            this.$bus.$on('windows-resized', this.setScenarios);
            $('#map').on('click', '.scenario', this.scenarioClicked);
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
            setScenarios() {
                const base = 0.79;
                this.factor = $(window).width() / 2484;
                this.scenarios = app.scenarios;
                this.scale = this.factor * base;

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
        .scenario {
            transform-origin: 0 0;

            &:hover {
                cursor: pointer;
            }
        }
    }
</style>
