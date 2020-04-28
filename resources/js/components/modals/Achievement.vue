<template>
    <div>
        <modal ref="modal">
            <template v-slot:body v-if="achievement">
                <div id="achivement-title" class="pl-6 border-b border-white2-25">
                    <h2 class="mdc-dialog__title p-0 leading-none">{{ achievement.name }}
                        <span class="absolute right-0 top-0 mt-4">
                        <button type="button" data-mdc-dialog-action="close"
                                class="mdc-button ">
                            <i class="material-icons">close</i>
                        </button>
                        </span>
                    </h2>
                </div>

                <div class="mdc-dialog__content" id="achievement-content">
                    <!-- TODO: Maybe add flavortext/story for the Achievements -->

                    <h2 class="text-white">Gained from:
                        <scenario-number class="ml-2"
                                         v-for="scenario in awardedFrom"
                                         data-mdc-dialog-action="close"
                                         :scenario="scenario" :key="scenario.id"/>
                    </h2>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
    import ScenarioRepository from "../../repositories/ScenarioRepository";
    import {ScenarioState} from "../../models/ScenarioState";
    import PreloadImage from "../../services/PreloadImage";
    import AchievementRepository from "../../repositories/AchievementRepository";
    import ScenarioNumber from "../elements/ScenarioNumber";

    export default {
        components: {ScenarioNumber},
        data() {
            return {
                achievement: null,
                notes: null,
                stateKey: 1,
                questExpand: [],
                scenarioRepository: new ScenarioRepository(),
                achievementRepository: new AchievementRepository(),
                preloadImage: new PreloadImage()
            }
        },
        mounted() {
            this.$bus.$on('open-achievement', (data) => {
                this.open(data.id);
            });
        },
        computed: {
            awardedFrom() {
                return this.scenarioRepository
                    .findWhere((scenario, key) => scenario.achievements_awarded && scenario.achievements_awarded.contains(this.achievement.id))
                    .where('state', ScenarioState.complete);
            },
        },
        methods: {
            open(id) {
                this.achievement = this.achievementRepository.find(id);

                this.$nextTick(() => {
                    this.$refs['modal'].open();
                });
            },
            openScenario(id) {
                this.$bus.$emit('open-scenario', {
                    id: id
                });
                this.close();
            }
        }
    }
</script>

<style lang="scss">
    .mdc-notched-outline__notch {
        border-right: none;
        border-left: none;
    }
</style>
