<template>
    <div>
        <modal ref="modal" :title="achievement ? achievement.displayName : ''" :titleDivider="true">
            <template v-slot:content>
                <div class="flex flex-row justify-between" v-if="achievement">
                    <button v-if="achievement.is_manual"
                            class="mdc-button mdc-button--raised origin-right transform scale-75 absolute right-0 top-0 mr-6 mt-18"
                            @click="removeManualAchievement(achievement)">
                        <i class="material-icons mdc-button__icon">delete</i>
                        <span class="mdc-button__label">{{ $t('Remove') }}</span>
                    </button>

                    <div class="i-my-4">
                        <!-- TODO: Maybe add flavor text/story for the Achievements -->
                        <h2 v-if="!awardedFrom.isEmpty()" class="text-white">{{ $t('Gained from') }}:
                            <scenario-number class="ml-2"
                                             v-for="scenario in awardedFrom"
                                             data-mdc-dialog-action="close"
                                             :scenario="scenario" :key="scenario.id"/>
                        </h2>

                        <template v-if="achievement.hasCard()">
                            <h2 class="text-white">{{ $t('Gained from') }}:</h2>
                            <cards :cards="achievement.cards"></cards>
                        </template>

                        <h2 v-if="!requiredBy.isEmpty()"
                            class="text-white mt-2">{{ $t('Required by') }}:
                            <scenario-number class="ml-2"
                                             v-for="scenario in requiredBy"
                                             data-mdc-dialog-action="close"
                                             :scenario="scenario" :key="scenario.id"/>
                        </h2>
                    </div>
                    <div class="w-12">
                        <webp v-if="achievement.isGlobal()"
                              :src="achievement.image"
                              :animate="true"
                              :alt="achievement.displayName"/>
                    </div>
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
            isNotUnlockedChecked: false,
            scenarioRepository: new ScenarioRepository(),
            achievementRepository: new AchievementRepository()
        }
    },
    mounted() {
        this.$bus.$on('open-achievement', (data) => {
            this.open(data.id);
        });
    },
    computed: {
        awardedFrom() {
            return this.scenarioRepository.awardedFrom(this.achievement);
        },
        requiredBy() {
            return this.scenarioRepository.requiredBy(this.achievement);
        },
    },
    methods: {
        async open(id) {
            this.achievement = this.achievementRepository.find(id);
            this.isNotUnlockedChecked = false;

            await this.$nextTick();
            this.$refs['modal'].open();
        },
        close() {
            this.$refs['modal'].close();
        },
        removeManualAchievement(achievement) {
            if (achievement.upgrades.length > 0) {
                achievement._manual_awarded = false;
            }
            this.achievementRepository.remove(achievement.id);
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
