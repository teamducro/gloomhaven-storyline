<template>
    <span>
        <template class="w-full requirements-list" v-for="(condition, conditionIndex) in conditionsFiltered">
            <div class="w-full" v-for="(requirement, requirementIndex) in condition.requirements">
                <span class="flex items-center">
                    <i v-if="(conditionsFiltered.length > 1 || condition.requirements.length > 1) && requirementNotMet(requirement)"
                       class="material-icons text-incomplete text-lg mr-1">error_outline</i>
                    {{ requirement.achievement.name }} ({{ $t(requirement.achievement.type) }})
                    {{ $t(requirement.state).toUpperCase() }}
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

export default {
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
                .transform((item) => {
                    return {
                        "achievement": this.achievementRepository.find(item),
                        "state": "Complete"
                    }
                });
            let incomplete = collect(condition.incomplete || [])
                .transform((item) => {
                    return {
                        "achievement": this.achievementRepository.find(item),
                        "state": "Incomplete"
                    }
                });

            return complete.items.concat(incomplete.items);
        },
        requirementNotMet(requirement) {
            if (this.scenarioState === "complete") {
                return false;
            }

            let achievement = this.achievementRepository.find(requirement.achievement.id);
            if (requirement.state === "Complete" && !achievement.awarded ||
                (requirement.state === "Incomplete" && achievement.awarded)) {
                return true;
            }

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
