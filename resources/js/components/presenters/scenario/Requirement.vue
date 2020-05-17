<template>
    <span>
        <template class="w-full requirements-list" v-for="(condition, conditionIndex) in conditionsFiltered">
            <div class="w-full" v-for="(requirement, requirementIndex) in requiredAchievements(condition)">
                <span :class="{'text-incomplete' : requirementNotMet(requirement)}"
                      @click="openAchievement(requirement.achievement.id)">
                    {{ requirement.achievement.name }} ({{ $t(requirement.achievement.type) }})
                    {{ $t(requirement.type).toUpperCase() }}
                </span>
                <template v-if="requirementIndex + 1 < requiredAchievements(condition).length"
                          class="separator">
                    and
                </template>
                <template v-if="conditionIndex + 1 < conditionsFiltered.length" class="separator">
                    or
                </template>
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
                return this.conditions.filter((c) => {
                    if (!c.hidden_when) {
                        return true;
                    }
                    return !this.achievementRepository.findMany(c.hidden_when).contains((a) => a.awarded);
                }).all();
            }
        },
        methods: {
            requiredAchievements(condition) {
                let complete = collect(condition.complete || [])
                    .transform((item) => {
                        return {
                            "achievement": this.achievementRepository.find(item),
                            "type": "Complete"
                        }
                    });
                let incomplete = collect(condition.incomplete || [])
                    .transform((item) => {
                        return {
                            "achievement": this.achievementRepository.find(item),
                            "type": "Incomplete"
                        }
                    });

                return complete.items.concat(incomplete.items);
            },
            requirementNotMet(requirement) {
                if (this.scenarioState === "complete") {
                    return false;
                }

                let achievement = this.achievementRepository.find(requirement.achievement.id);
                if (requirement.type === "Complete" && !achievement.awarded ||
                    (requirement.type === "Incomplete" && achievement.awarded)) {
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
<style lang="scss" scoped>
</style>
