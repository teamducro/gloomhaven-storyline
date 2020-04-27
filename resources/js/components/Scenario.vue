<template>
    <div>
        <modal ref="modal">
            <template v-slot:body v-if="scenario">
                <div id="scenario-title" class="pl-6 border-b border-white2-25"
                     :class="{'pb-2': scenario.regions, 'pb-4': !scenario.regions}">
                    <h2 class="mdc-dialog__title p-0 leading-none">{{ scenario.isVisible() ? scenario.name :
                        '#' + scenario.id }}
                        <span class="text-sm text-white2-50">{{ scenario.coordinates.name }}</span>
                        <button type="button" data-mdc-dialog-action="close"
                                class="mdc-button absolute right-0 top-0 mt-4">
                            <i class="material-icons">close</i>
                        </button>
                    </h2>
                    <span v-if="scenario.regions" class="text-sm text-white2-50 font-bold">{{ scenario.regions.pluck('name').implode(', ') }}</span>
                </div>

                <div class="mdc-dialog__content" id="scenario-content">
                    <div class="xs:flex w-full mb-2">
                        <radio v-if="scenario.is_side"
                               class="whitespace-no-wrap"
                               id="hidden" group="states" label="Not unlocked"
                               :key="'hidden-' + stateKey"
                               :checked="scenario.isHidden()"
                               @changed="stateChanged"
                        ></radio>
                        <div class="flex w-full">
                            <radio id="incomplete" group="states" :label="$t('general.incomplete')"
                                   :key="'incomplete-' + stateKey"
                                   :checked="scenario.isIncomplete()"
                                   :disabled="scenario.isBlocked() || scenario.isRequired()"
                                   @changed="stateChanged"
                            ></radio>
                            <radio id="complete" group="states" :label="$t('general.complete')"
                                   :key="'complete-' + stateKey"
                                   :checked="scenario.isComplete()"
                                   :disabled="scenario.isBlocked() || scenario.isRequired()"
                                   @changed="stateChanged"
                            ></radio>
                            <div v-if="scenario.isVisible()"
                                 class="hidden sm:block ml-auto w-20"
                                 :class="{'sm:block': scenario.is_side, 'xs:block': !scenario.is_side}">
                                <webp :src="scenario.image()"
                                      :animate="true"
                                      :alt="scenario.name"/>
                            </div>
                        </div>
                    </div>

                    <template v-if="scenario.isVisible()">

                        <div v-if="scenario.requirements" class="mb-2 flex items-center" style="padding-left: 7px;">
                            <i v-if="scenario.isRequired() || scenario.isBlocked()"
                               class="material-icons text-incomplete text-2xl mr-2">highlight_off</i>
                            <i v-else class="material-icons text-complete text-2xl mr-2">check_circle_outline</i>
                            Requirements: {{ scenario.requirements }}
                        </div>

                        <div class="mt-4 mb-2"
                             v-if="scenario.isVisible() && !scenario.isComplete() && !treasuresVisible">
                            <button class="mdc-button origin-left transform scale-75 mdc-button--raised"
                                    @click="treasuresVisible = true">
                                <i class="material-icons mdc-button__icon">attach_money</i>
                                <span class="mdc-button__label">Show treasures</span>
                            </button>
                        </div>

                        <div class="my-2"
                             v-if="(scenario.isComplete() || treasuresVisible) && scenario.treasures.isNotEmpty()">
                            <h2 class="text-white" style="padding-left: 12px;">Treasures</h2>
                            <div v-if="scenario.treasures.isNotEmpty()"
                                 v-for="(treasure, id) in scenario.treasures.items" :key="id"
                                 class="flex items-center">
                                <checkbox
                                        :id="id"
                                        :label="'#' + id"
                                        :checked="scenario.isTreasureUnlocked(id)"
                                        @changed="treasureChanged"></checkbox>
                                <span v-if="scenario.isTreasureUnlocked(id)" class="ml-4">{{ treasure }}</span>
                            </div>
                        </div>
                        <p class="mb-2" v-if="scenario.treasures.isEmpty() && treasuresVisible">
                            No treasures available.
                        </p>

                        <div class="my-2 flex flex-col items-start"
                             v-if="nextScenarios.count()">
                            <h2 class="text-white" style="padding-left: 12px;">
                                {{ nextScenarios.count() > 1 ? 'New locations' : 'New location' }}
                            </h2>
                            <button v-for="scenario in nextScenarios" type="button" class="mdc-button normal-case"
                                    @click="open(scenario.id)">
                                <span class="mdc-button__label">{{ scenario.name }}</span>
                            </button>
                        </div>

                        <template if="achievements" v-for="(x, is_global) in achievements">
                            <template v-for="(y, is_awarded) in x">
                                <div class="my-2 flex flex-col items-start"
                                     v-if="y.count()">
                                    <h2 class="text-white" style="padding-left: 12px;">
                                        {{ is_awarded ? '' : 'Lost' }}
                                        {{ is_global ? 'Global' : 'Party' }}
                                        {{ y.count > 1 ? 'Achievements' : 'Achievement' }}
                                    </h2>
                                    <button v-for="achievement in y" type="button"
                                            class="mdc-button normal-case"
                                            @click="openAchievement(achievement.id)">
                                        <span class="mdc-button__label">{{ achievement.name }}</span>
                                    </button>
                                </div>
                            </template>
                        </template>

                        <div class="mb-3 flex flex-col items-start">
                            <template v-for="(quest, index) in scenario.quests">
                                <button class="mdc-button normal-case"
                                        @click="toggleQuest(index)">
                                    <i class="material-icons mdc-button__icon">notes</i>
                                    <span class="mdc-button__label">{{ $t(quest.name) }}</span>
                                    <i class="material-icons mdc-button__icon transform transition-transform duration-500"
                                       :class="{'rotate-0': questExpand[index], 'rotate-180': !questExpand[index]}">
                                        keyboard_arrow_up
                                    </i>
                                </button>
                                <transition-expand>
                                    <div v-if="questExpand[index]">
                                        <i18n :path="quest.description" tag="div">
                                            <template v-for="n in [1,2,3,4,5,6,7,8,9]" v-slot:[n]>
                                                <p class="mb-4">{{ $t('quest.' + quest.id + '.sections.' + n) }}</p>
                                            </template>
                                            <template v-slot:br>
                                                <br><br>
                                            </template>
                                        </i18n>
                                    </div>
                                </transition-expand>
                            </template>

                            <template v-if="scenario.hasCard()"
                                      v-for="(card, index) in scenario.cards">
                                <button class="mdc-button"
                                        @click="toggleQuest(questCount + index)">
                                    <i class="material-icons mdc-button__icon">notes</i>
                                    <span class="mdc-button__label">{{ card.title }}</span>
                                    <i class="material-icons mdc-button__icon transition-transform duration-500"
                                       :class="{'rotate-0': questExpand[questCount + index], 'rotate-180': !questExpand[questCount + index]}">
                                        keyboard_arrow_up
                                    </i>
                                </button>
                                <transition-expand>
                                    <div v-if="questExpand[questCount + index]">
                                        <webp v-for="(image, index) in card.images"
                                              :key="card.id + '-' + index"
                                              :src="image"
                                              class="mb-4"
                                              :alt="card.title"/>
                                    </div>
                                </transition-expand>
                            </template>
                        </div>

                        <div class="mb-6 hidden">
                            <div class="mdc-text-field mdc-text-field--textarea w-full"
                                 ref="notes">
                                <textarea id="notes" @change="noteChanged" v-model="scenario.notes"
                                          class="mdc-text-field__input" rows="4" cols="40"></textarea>
                                <div class="mdc-notched-outline">
                                    <div class="mdc-notched-outline__leading"></div>
                                    <div class="mdc-notched-outline__notch">
                                        <label for="notes" class="mdc-floating-label">Notes</label>
                                    </div>
                                    <div class="mdc-notched-outline__trailing"></div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center mb-6">
                            <button class="mdc-button mdc-button--raised" @click="openPages()">
                                <i class="material-icons mdc-button__icon">menu_book</i>
                                <span class="mdc-button__label">{{ $t('pages') }}</span>
                            </button>
                            <div class="ml-auto w-20"
                                 :class="{'sm:hidden': scenario.is_side, 'xs:hidden': !scenario.is_side}">
                                <webp :src="scenario.image()"
                                      :animate="true"
                                      :alt="scenario.name"/>
                            </div>
                        </div>
                    </template>
                </div>
                <footer class="mdc-dialog__actions flex justify-between">
                    <div>
                        <button v-for="scenario in prevScenarios" type="button" class="mdc-button"
                                @click="open(scenario.id)">
                            <i class="material-icons">navigate_before</i>
                            <span class="mdc-button__label">{{ scenario.id }}</span>
                        </button>
                    </div>
                    <div>
                        <button v-for="scenario in nextScenarios" type="button" class="mdc-button"
                                @click="open(scenario.id)">
                            <span class="mdc-button__label">{{ scenario.id }}</span>
                            <i class="material-icons">navigate_next</i>
                        </button>
                    </div>
                </footer>
            </template>
        </modal>
        <pages v-if="scenario" ref="pages"
               :pages="scenario.pages"
        ></pages>
        <choose v-if="scenario && scenario.choices" ref="choose"
                :scenario-ids="scenario.choices"
                @scenario-chosen="scenarioChosen"
                @closing="chooseModalClosing"
        ></choose>
    </div>
</template>

<script>
    import ScenarioRepository from "../repositories/ScenarioRepository";
    import AchievementRepository from "../repositories/AchievementRepository";
    import {MDCTextField} from "@material/textfield/component";
    import {ScenarioState} from "../models/ScenarioState";
    import PreloadImage from "../services/PreloadImage";

    export default {
        data() {
            return {
                scenario: null,
                notes: null,
                stateKey: 1,
                questExpand: [],
                treasuresVisible: false,
                scenarioRepository: new ScenarioRepository(),
                achievementRepository: new AchievementRepository(),
                preloadImage: new PreloadImage()
            }
        },
        mounted() {
            this.$bus.$on('open-scenario', (data) => {
                this.open(data.id);
            });
        },
        computed: {
            blockedScenarios() {
                return this.scenarioRepository.findMany(this.scenario.blocked_by)
                    .where('state', ScenarioState.complete);
            },
            requiredScenarios() {
                return this.scenarioRepository.findMany(this.scenario.required_by)
                    .where('state', ScenarioState.incomplete);
            },
            prevScenarios() {
                return this.scenarioRepository.findMany(this.scenario.linked_from)
                    .where('state', ScenarioState.complete);
            },
            nextScenarios() {
                if (this.scenario.isComplete()) {
                    return this.scenarioRepository.findMany(this.scenario.links_to)
                        .where('state', '!=', ScenarioState.hidden);
                }

                return collect();
            },
            achievements() {
                if (this.scenario.isComplete()) {
                    let awarded = this.achievementRepository.findMany(this.scenario.achievements_awarded)
                        .where('_awarded', '=', true);
                    let lost = this.achievementRepository.findMany(this.scenario.achievements_lost)
                        .where('_awarded', '=', false);

                    return [[
                        lost.where('type', '=', 'party'),
                        awarded.where('type', '=', 'party')
                    ], [
                        lost.where('type', '=', 'global'),
                        awarded.where('type', '=', 'global')
                    ]];
                }

                return null;
            },
            awardedGlobalAchievements() {
                return this.awardedAchievements.where('type', '=', 'global');
            },
            awardedPartyAchievements() {
                return this.awardedAchievements.where('type', '=', 'party');
            },
            lostAchievements() {
                if (this.scenario.isComplete()) {
                    return this.achievementRepository.findMany(this.scenario.achievements_lost)
                        .where('_awarded', '=', false);
                }

                return collect();
            },
            lostGlobalAchievements() {
                return this.lostAchievements.where('type', '=', 'global');
            },
            lostPartyAchievements() {
                return this.lostAchievements.where('type', '=', 'party');
            },
            questCount() {
                return this.scenario.quests.length || 0;
            }
        },
        methods: {
            stateChanged(state) {
                if (state === ScenarioState.complete && this.scenario.choices) {
                    this.$refs['choose'].open();
                } else {
                    this.scenarioRepository.changeState(this.scenario, state);
                }

                this.$bus.$emit('scenarios-updated');
            },
            noteChanged() {
                this.scenario.store();
            },
            treasureChanged(id, checked) {
                this.scenario.unlockTreasure(id, checked);

                if (this.scenarioRepository.unlockTreasureScenario(this.scenario, id)) {
                    this.$bus.$emit('scenarios-updated');
                }
            },
            scenarioChosen(choice) {
                this.scenarioRepository.choose(this.scenario, choice);

                this.$bus.$emit('scenarios-updated');
            },
            chooseModalClosing(action) {
                if (action !== 'chosen') {
                    this.rerenderStateSelection();
                }
            },
            toggleQuest(index) {
                this.$set(this.questExpand, index, !this.questExpand[index]);
            },
            openPages() {
                this.$refs['pages'].open();
            },
            rerenderStateSelection() {
                this.stateKey++;
            },
            open(id) {
                this.scenario = this.scenarioRepository.find(id);
                this.treasuresVisible = false;

                let questCount = this.questCount + this.scenario.cards.count();
                this.questExpand = new Array(questCount);
                if (this.scenario.hasCard()) {
                    this.scenario.cards.each((card) => {
                        card.images.forEach((image) => {
                            this.preloadImage.handle(image);
                        });
                    });
                }

                this.rerenderStateSelection();

                this.$nextTick(() => {
                    this.$refs['modal'].open();
                    this.$nextTick(() => {
                        this.$refs['pages'].preload();
                        const notes = this.$refs['notes'];
                        if (notes) {
                            new MDCTextField(notes);
                        }
                    });
                });
            },
            close() {
                this.$refs['modal'].close();
            },
            openAchievement(id) {
                this.close();
                console.log(id);
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

<i18n>
    {
    "en": {
    "pages": "pages"
    },
    "de": {
    "pages": "seiten"
    },
    "fr": {
    "pages": "pages"
    }
    }
</i18n>
