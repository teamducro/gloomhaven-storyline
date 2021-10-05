<template>
    <div v-if="enabled">
        <div class="pt-16 pb-4 px-4 flex flex-col">

            <div class="fixed right-0 top-0 mt-1 z-5">
                <dropdown ref="achievement-to-add-dropdown" align="right"
                          @open="dropDownClose = true"
                          @close="dropDownClose = false"
                          @opened="achievementToAddOpened"
                          @closed="achievementToAddClosed">
                    <template v-slot:trigger>
                        <button type="button"
                                class="mdc-icon-button mdc-button--raised material-icons p-2 mr-2 mt-2 !bg-black2-50 rounded-full transform transition-transform"
                                :class="{'rotate-45': dropDownClose}">
                            add
                        </button>
                    </template>

                    <div class="mdc-list w-40">
                        <p class="text-white text-sm">
                            Add achievements gained by events other than completing scenarios manually.
                        </p>
                        <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="achievement-to-add">
                            <span class="mdc-text-field__ripple"></span>
                            <input class="mdc-text-field__input" aria-labelledby="achievement-to-add-label"
                                   type="text" name="achievement-to-add"
                                   v-model="achievementQuery" @keyup="filterAchievementsToAdd">
                            <span class="mdc-floating-label" id="achievement-to-add-label">Achievement</span>
                            <span class="mdc-line-ripple"></span>
                        </label>

                        <ul v-if="!achievementsToAdd.isEmpty()" class="mdc-list" aria-hidden="true"
                            aria-orientation="vertical" tabindex="-1">
                            <li v-for="achievement in achievementsToAdd"
                                class="mdc-list-item cursor-pointer" @click="addAchievement(achievement)">
                                <span class="mdc-list-item__text">{{ achievement.name }}</span>
                            </li>
                        </ul>
                    </div>
                </dropdown>
            </div>

            <div class="w-full flex justify-center">
                <h1>{{ $t('Global') }} {{ $t('Achievements') }}</h1>
            </div>
            <div class="w-full flex justify-center">
                <ul v-if="achievements" id="global-achievements" class="mdc-list bg-black2-25 p-2 rounded-lg mt-4"
                    ref="global-list">
                    <li v-for="achievement in achievements.items"
                        v-if="achievement.isGlobal() && achievement.awarded && !achievement.hidden"
                        :key="achievement.id"
                        class="mdc-list-item h-auto cursor-pointer"
                        :tabindex="achievement.id">
                        <template>
                    <span class="mdc-list-item__text opacity-75">
                        {{ achievement.displayName }}
                    </span>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
        <div class="pt-4 pb-4 px-4 flex flex-wrap">
            <div class="w-full flex justify-center">
                <h1>{{ $t('Party') }} {{ $t('Achievements') }}</h1>
            </div>
            <div class="w-full flex justify-center">
                <ul v-if="achievements" id="party-achievements" class="mdc-list bg-black2-25 p-2 rounded-lg mt-4"
                    ref="party-list">
                    <li v-for="achievement in achievements.items"
                        v-if="achievement.isParty() && achievement.awarded"
                        :key="achievement.id"
                        class="mdc-list-item h-auto cursor-pointer"
                        :tabindex="achievement.id">
                        <template>
                    <span class="mdc-list-item__text opacity-75">
                        {{ achievement.name }}
                    </span>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div v-else>
        <h1 class="pt-16 text-center">{{ $t('No achievements in ') }} {{ $t(game) }}</h1>
    </div>
</template>

<script>
import AchievementRepository from "../repositories/AchievementRepository";
import {MDCList} from "@material/list/component";
import {MDCTextField} from "@material/textfield/component";

export default {
    data() {
        return {
            enabled: true,
            game: 'gh',
            globalList: null,
            partyList: null,
            achievements: null,
            regionFilter: null,
            missedTreasuresFilter: null,
            stateFilter: null,
            filter: null,
            achievementQuery: '',
            achievementsToAdd: collect(),
            dropDownClose: false,
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
        if (this.globalList) {
            this.globalList.destroy();
        }
        if (this.partyList) {
            this.partyList.destroy();
        }
        this.$bus.$off('achievements-updated', this.setAchievements);
    },
    methods: {
        async setAchievements() {
            this.enabled = app.game !== 'jotl';
            this.game = app.game;
            this.achievements = app.achievements.sortBy('name');

            await this.$nextTick();

            if (this.globalList) {
                this.globalList.destroy();
            }
            if (this.$refs['global-list']) {
                this.globalList = MDCList.attachTo(this.$refs['global-list']);
                this.globalList.listen('MDCList:action', (event) => {
                    const id = this.achievements.filter((a) => {
                        return a.isGlobal() && a.awarded && !a.hidden;
                    }).get(event.detail.index).id;
                    this.open(this.achievementRepository.find(id));
                });
            }

            if (this.partyList) {
                this.partyList.destroy();
            }
            if (this.$refs['party-list']) {
                this.partyList = MDCList.attachTo(this.$refs['party-list']);
                this.partyList.listen('MDCList:action', (event) => {
                    const id = this.achievements.filter((a) => {
                        return a.isParty() && a.awarded;
                    }).get(event.detail.index).id;
                    this.open(this.achievementRepository.find(id));
                });
            }
        },
        achievementToAddOpened() {
            this.achievementToAddField = new MDCTextField(this.$refs['achievement-to-add']);
        },
        achievementToAddClosed() {
            if (this.achievementToAddField) {
                this.achievementToAddField.destroy();
            }
        },
        filterAchievementsToAdd() {
            if (this.achievementQuery.length > 1) {
                this.achievementsToAdd = this.achievementRepository.searchManual(this.achievementQuery);
            } else {
                this.achievementsToAdd = collect();
            }
        },
        addAchievement(achievement) {
            if (achievement.upgrades.length > 0) {
                achievement._manual_awarded = true;
            }
            this.achievementRepository.gain(achievement.id);
            this.achievementQuery = '';
            this.achievementsToAdd = collect();
            this.$refs['achievement-to-add-dropdown'].close();
        },
        open(achievement) {
            this.$bus.$emit('open-achievement', {
                id: achievement.id
            });
        },
    }
}
</script>
