<template>
    <div>
        <div class="pt-12 pb-4 px-4 flex flex-col ">
            <div class="w-full flex justify-center">
                <h1>Global Achievements</h1>
            </div>
            <div class="w-full flex justify-center">
                <ul v-if="achievements" id="global-achievements" class="mdc-list bg-black2-25 p-2 rounded-lg mt-4"
                    ref="global-list">
                    <li v-for="achievement in achievements.items"
                        v-show="achievement.type === 'global' && achievement.awarded && !achievement.hidden"
                        :key="achievement.id"
                        class="mdc-list-item h-auto cursor-pointer"
                        :data-id="achievement.id"
                        :tabindex="achievement.id">
                        <template>
                    <span class="mdc-list-item__text opacity-50">
                        {{ achievement.displayName }}
                    </span>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
        <div class="pt-4 pb-4 px-4 flex flex-wrap">
            <div class="w-full flex justify-center">
                <h1>Party Achievements</h1>
            </div>
            <div class="w-full flex justify-center">
                <ul v-if="achievements" id="party-achievements" class="mdc-list bg-black2-25 p-2 rounded-lg mt-4"
                    ref="party-list">
                    <li v-for="achievement in achievements.items"
                        v-show="achievement.type === 'party' && achievement.awarded"
                        :key="achievement.id"
                        class="mdc-list-item h-auto cursor-pointer"
                        :data-id="achievement.id"
                        :tabindex="achievement.id">
                        <template>
                    <span class="mdc-list-item__text opacity-50">
                        {{ achievement.name }}
                    </span>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import AchievementRepository from "../../repositories/AchievementRepository";
    import {MDCList} from "@material/list/component";

    export default {
        data() {
            return {
                list: null,
                achievements: null,
                regionFilter: null,
                missedTreasuresFilter: null,
                stateFilter: null,
                filter: null,
                achievementRepository: new AchievementRepository()
            }
        },
        mounted() {
            if (app.achievements) {
                this.setAchievements();
            }

            this.$bus.$on('achievements-updated', this.setAchievements);
        },
        destroyed() {
            if (this.list) {
                this.list.destroy();
            }
            this.$bus.$off('achievements-updated', this.setAchievements);
        },
        methods: {
            setAchievements() {
                this.achievements = app.achievements;

                this.$nextTick(() => {
                    this.list = MDCList.attachTo(this.$refs['global-list']);
                    this.list.listen('MDCList:action', (event) => {
                        let id = $(event.target).find('li:eq(' + event.detail.index + ')').data('id');
                        this.open(this.achievementRepository.find(id));
                    });
                    this.list = MDCList.attachTo(this.$refs['party-list']);
                    this.list.listen('MDCList:action', (event) => {
                        let id = $(event.target).find('li:eq(' + event.detail.index + ')').data('id');
                        this.open(this.achievementRepository.find(id));
                    });

                });
            },
            open(scenario) {
                this.$bus.$emit('open-achievement', {
                    id: scenario.id
                });
            },
        }
    }
</script>
