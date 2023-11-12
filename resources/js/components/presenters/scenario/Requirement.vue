<template>
    <span>
        <template class="w-full requirements-list" v-for="(condition, conditionIndex) in conditionsFiltered">
            <div class="w-full" v-for="(requirement, requirementIndex) in condition.requirements">
                <span class="flex items-center">
                    <i v-if="(conditionsFiltered.length > 1 || condition.requirements.length > 1) && requirementNotMet(requirement)"
                       class="material-icons text-incomplete text-lg mr-1">error_outline</i>
                    <template v-if="requirement.achievement">
                        {{ $t(requirement.achievement.name) }} ({{ $t(requirement.achievement.type) }})
                        {{ $t(requirement.state).toUpperCase() }}
                    </template>
                    <template v-if="requirement.scenario">
                        <scenario-number :scenario="requirement.scenario" show-name />
                        <span>&nbsp;{{ $t(requirement.state).toUpperCase() }}&nbsp;</span>
                    </template>
                    <template v-if="requirementIndex + 1 < condition.requirements.length">
                        {{ $t('and') }}
                    </template>
                    <template v-if="conditionIndex + 1 < conditionsFiltered.length">
                        {{ $t('or') }}
                    </template>
                </span>
            </div>
        </template>
    </span>
</template>

<script>


import AchievementRepository from "../../../repositories/AchievementRepository";
import ScenarioRepository from "../../../repositories/ScenarioRepository";
import {ScenarioState} from "../../../models/ScenarioState";
import ScenarioNumber from "../../elements/ScenarioNumber.vue";

export default {
    components: {ScenarioNumber},
    props: {
        conditions: {
            type: Object
        },
        scenarioState: {
            type: String
        }
    },
    data() {
        return {
            achievementRepository: new AchievementRepository(),
            scenarioRepository: new ScenarioRepository(),
        };
    },
    computed: {
        conditionsFiltered() {
            return this.conditions.filter((condition) => {
                if (!condition.hidden_when && !condition.hidden) {
                    return true;
                }

                if (condition.hidden) {
                    return false;
                }

                return !this.achievementRepository
                    .findMany(condition.hidden_when)
                    .contains((achievement) => achievement.awarded);
            }).map((condition) => {
                condition.requirements = this.requiredAchievements(condition);
                return condition;
            }).all();
        }
    },
    methods: {
        requiredAchievements(condition) {
            let complete = collect(condition.complete || [])
                .transform((scenarioOrAchievementId) => {
                    if (Number.isInteger(scenarioOrAchievementId)) {
                        return {
                            "scenario": this.scenarioRepository.find(scenarioOrAchievementId),
                            "state": ScenarioState.complete
                        }
                    } else {
                        return {
                            "achievement": this.achievementRepository.find(scenarioOrAchievementId),
                            "state": ScenarioState.complete
                        }
                    }
                });
            let incomplete = collect(condition.incomplete || [])
                .transform((scenarioOrAchievementId) => {
                    if (Number.isInteger(scenarioOrAchievementId)) {
                        return {
                            "scenario": this.scenarioRepository.find(scenarioOrAchievementId),
                            "state": ScenarioState.incomplete
                        }
                    } else {
                        return {
                            "achievement": this.achievementRepository.find(scenarioOrAchievementId),
                            "state": ScenarioState.incomplete
                        }
                    }
                });

            return complete.items.concat(incomplete.items);
        },
        requirementNotMet(requirement) {
            if (this.scenarioState === ScenarioState.complete) {
                return false;
            }

            // Check achievements
            if (requirement.achievement) {
                if (requirement.state === ScenarioState.complete && !requirement.achievement.awarded ||
                    (requirement.state === ScenarioState.incomplete && requirement.achievement.awarded)) {
                    return true;
                }
            }

            // Check scenarios
            if (requirement.scenario) {
                if (requirement.state === ScenarioState.complete && requirement.scenario.isIncomplete() ||
                    (requirement.state === ScenarioState.incomplete && requirement.scenario.isComplete())) {
                    return true;
                }
            }

            return false;
        },
        openAchievement(id) {
            this.$bus.$emit('close-scenario', {});
            this.$bus.$emit('open-achievement', {
                id: id
            });
        },
    },
    filters: {
        capitalize: function (value) {
            if (!value) {
                return "";
            }
            value = value.toString();
            return value.charAt(0).toLocaleUpperCase() + value.slice(1);
        }
    }

}
</script>
