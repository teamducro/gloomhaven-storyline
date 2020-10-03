<template>
    <div>
        <modal ref="modal">
            <template v-slot:body v-if="scenario">
                <div id="scenario-title" class="pl-6 border-b border-white2-25"
                     :class="{'pb-2': scenario.regions, 'pb-4': !scenario.regions}">
                    <h2 class="mdc-dialog__title p-0 leading-none">
                        {{ scenario.isVisible() ? scenario.title : '#' + scenario.id }}
                        <span class="text-sm text-white2-50">{{ scenario.coordinates.name }}</span>
                        <span class="absolute right-0 top-0">
                        <button type="button" data-mdc-dialog-action="close"
                                class="mdc-button mt-4">
                            <i class="material-icons">close</i>
                        </button>
                        </span>
                    </h2>
                    <span v-if="scenario.regions" class="text-sm text-white2-50 font-bold">{{
                            scenario.regions.pluck('name').implode(', ')
                        }}</span>
                </div>

                <div class="mdc-dialog__content" id="scenario-content">
                    <div class="xs:flex w-full -ml-2 mb-2">
                        <radio v-if="scenario.is_side"
                               class="whitespace-no-wrap"
                               id="hidden" group="states" :label="$t('Not unlocked')"
                               :key="'hidden-' + stateKey"
                               :checked="scenario.isHidden()"
                               @changed="stateChanged"
                        ></radio>
                        <div class="flex w-full">
                            <radio id="incomplete" group="states" :label="$t('Incomplete')"
                                   :key="'incomplete-' + stateKey"
                                   :checked="scenario.isIncomplete()"
                                   :disabled="scenario.isBlocked() || scenario.isRequired()"
                                   @changed="stateChanged"
                            ></radio>
                            <radio id="complete" group="states" :label="$t('Complete')"
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

                        <div v-if="scenario.requirements">
                            <div class="flex flex-wrap" style="margin-left: -2px;">
                                <div class="w-full flex items-center">
                                    <i v-if="scenario.isRequired() || scenario.isBlocked()"
                                       class="material-icons text-incomplete text-2xl mr-2">highlight_off</i>
                                    <i v-else
                                       class="material-icons text-complete text-2xl mr-2">check_circle_outline</i>
                                    <span>{{ $t('Requirements') }}:</span>
                                </div>
                                <div class="ml-8">
                                    <requirement :conditions="scenario.required_by"
                                                 v-if="scenario.required_by.isNotEmpty()"
                                                 :scenarioState="scenario.state"></requirement>
                                    <span v-else>{{ scenario.requirements }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 mb-2"
                             v-if="scenario.isVisible() && !scenario.isComplete() && !treasuresVisible">
                            <button class="mdc-button origin-left transform scale-75 mdc-button--raised"
                                    @click="treasuresVisible = true">
                                <i class="material-icons mdc-button__icon">attach_money</i>
                                <span class="mdc-button__label">{{ $t('Show treasures') }}</span>
                            </button>
                        </div>

                        <div class="my-2"
                             v-if="(scenario.isComplete() || treasuresVisible) && scenario.treasures.isNotEmpty()">
                            <h2 class="text-white">{{ $t('Treasures') }}</h2>
                            <div v-if="scenario.treasures.isNotEmpty()"
                                 v-for="(treasure, id) in scenario.treasures.items" :key="id"
                                 class="flex items-center -ml-2">
                                <checkbox-with-label
                                    :id="id"
                                    :label="'#' + id"
                                    :checked="scenario.isTreasureUnlocked(id)"
                                    @change="treasureChanged"></checkbox-with-label>
                                <span v-if="scenario.isTreasureUnlocked(id)" class="ml-4">{{ treasure }}</span>
                            </div>
                        </div>
                        <p class="mb-2"
                           v-if="!scenario.isComplete() && scenario.treasures.isEmpty() && treasuresVisible">
                            {{ $t('No treasures available.') }}
                        </p>

                        <template if="achievements" v-for="(x, is_global) in achievements">
                            <template v-for="(y, is_awarded) in x">
                                <div class="my-2 flex flex-col items-start"
                                     v-if="!y.isEmpty()">
                                    <h2 class="text-white">
                                        {{ is_awarded ? '' : $t('Lost') }}
                                        {{ is_global ? $t('Global') : $t('Party') }}
                                        {{ $tc('Achievement', y.count()) }}
                                    </h2>
                                    <div v-for="achievement in y"
                                         class="flex items-center">
                                        <button type="button"
                                                class="mdc-button normal-case -ml-2"
                                                @click="openAchievement(achievement.id)">
                                            <span class="mdc-button__label">{{ achievement.name }}</span>
                                        </button>
                                        <scenario-number class="ml-2"
                                                         v-for="scenario in requiredBy(achievement)"
                                                         :scenario="scenario" :key="scenario.id"/>
                                    </div>
                                </div>
                            </template>
                        </template>

                        <rewards :scenario="scenario"></rewards>

                        <div class="mb-3 flex flex-col items-start">
                            <template v-for="(quest, index) in quests">
                                <button class="mdc-button normal-case -ml-2"
                                        @click="toggleQuest(index)">
                                    <span class="mdc-button__label font-title text-white">
                                        <template v-if="questExpand[index]">
                                            {{ $t(quest.name) }}
                                        </template>
                                        <template v-else>
                                            {{ scenario.isComplete() ? $t('Summary') : $t('Preceding events') }}
                                        </template>
                                    </span>
                                    <i class="material-icons mdc-button__icon transform transition-transform duration-500 text-white"
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
                                <button class="mdc-button normal-case -ml-2"
                                        @click="toggleQuest(questCount + index)">
                                    <span class="mdc-button__label font-title text-white">{{ card.title }}</span>
                                    <i class="material-icons mdc-button__icon transform transition-transform duration-500 text-white"
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
                                        <label for="notes" class="mdc-floating-label">{{ $t('Notes') }}</label>
                                    </div>
                                    <div class="mdc-notched-outline__trailing"></div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center mb-6">
                            <button class="mdc-button mdc-button--raised" @click="openPages()">
                                <i class="material-icons mdc-button__icon">menu_book</i>
                                <span class="mdc-button__label">{{ $t('Pages') }}</span>
                            </button>
                            <div class="ml-auto w-20"
                                 :class="{'sm:hidden': scenario.is_side, 'xs:hidden': !scenario.is_side}">
                                <webp :src="scenario.image()"
                                      :animate="true"
                                      :alt="scenario.name"/>
                            </div>
                        </div>
                    </template>
                    <blockquote v-if="(scenario.id === 14 || scenario.id === 43) && scenario.isComplete()"
                                class="relative py-2 px-4 text-base italic border-l-4 quote">
                        <a class="absolute w-full h-full top-0 left-0" target="_blank"
                           href="https://boardgamegeek.com/thread/1722032/scenario-14-conclusion-spoilers"></a>
                        <p class="mb-4 max-w-sm">
                            The location numbers in the story text are just reminders. They themselves don't unlock
                            anything.</p>
                        <p class="flex items-center"><span class="material-icons">remove</span> Isaac Childres</p>
                    </blockquote>
                </div>
                <footer class="mdc-dialog__actions flex justify-between px-5">
                    <div class="space-x-2">
                        <scenario-number :scenario="scenario" v-for="scenario in prevScenarios" :key="scenario.id"/>
                    </div>
                    <div class="space-x-2">
                        <scenario-number :scenario="scenario" v-for="scenario in nextScenarios" :key="scenario.id"/>
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
        <decision-prompt v-if="scenario" ref="decision-prompt"
                         :config="prompt"
                         @closing="decisionPromptClosing">
        </decision-prompt>
    </div>
</template>

<script>
import ScenarioRepository from "../../repositories/ScenarioRepository";
import AchievementRepository from "../../repositories/AchievementRepository";
import ChoiceService from "../../services/ChoiceService";
import {MDCTextField} from "@material/textfield/component";
import {ScenarioState} from "../../models/ScenarioState";
import PreloadImage from "../../services/PreloadImage";

export default {
    data() {
        return {
            scenario: null,
            notes: null,
            stateKey: 1,
            questExpand: [],
            treasuresVisible: false,
            rollback: null,
            scenarioRepository: new ScenarioRepository(),
            achievementRepository: new AchievementRepository(),
            choiceService: new ChoiceService(),
            preloadImage: new PreloadImage(),
        }
    },
    mounted() {
        this.$bus.$on('open-scenario', (data) => {
            this.open(data.id);
        });
        this.$bus.$on('close-scenario', () => {
            this.close();
        });
    },
    computed: {
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
                    lost.where('type', '=', 'Party'),
                    awarded.where('type', '=', 'Party')
                ], [
                    lost.where('type', '=', 'Global'),
                    awarded.where('type', '=', 'Global')
                ]];
            }

            return null;
        },
        quests() {
            return this.scenario.quests.filter(quest => {
                return quest.stage !== undefined;
            })

        },
        questCount() {
            return this.quests.items.length || 0;
        },
        prompt() {
            return this.processPrompt()
        }
    },
    methods: {
        stateChanged(state) {
            if (state === ScenarioState.complete && this.prompt) {
                let previousState = this.scenario.state;
                this.rollback = () => {
                    this.scenarioRepository.changeState(this.scenario, previousState);
                    this.$bus.$emit('scenarios-updated');
                }
            }

            if (state === ScenarioState.complete && this.scenario.choices) {
                this.$refs['choose'].open();
            } else {
                this.scenarioRepository.changeState(this.scenario, state);
                this.$bus.$emit('scenarios-updated');
            }
        },
        noteChanged() {
            this.scenario.store();
        },
        treasureChanged(id, checked) {
            if (checked && this.prompt) {
                this.rollback = () => {
                    this.scenario.unlockTreasure(id, false);
                }
            }

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
        decisionPromptClosing(action) {
            if (action !== 'chosen' && typeof this.rollback === 'function') {
                this.rollback();
                this.chooseModalClosing(action);
            }
            this.rollback = null;
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
        requiredBy(achievement) {
            return this.scenarioRepository.requiredBy(achievement);
        },
        open(id) {
            this.scenario = this.scenarioRepository.find(id);
            this.treasuresVisible = false;
            this.rollback = null;

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
            this.$bus.$emit('open-achievement', {
                id: id
            });
        },
        processPrompt() {
            return this.choiceService.getPromptConfig(this.scenario);
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
