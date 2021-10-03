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
                    <span v-if="scenario.regions" class="text-sm text-white2-50 font-bold">
                        {{ scenario.regions.pluck('name').map(name => $t(name)).join(', ') }}
                    </span>
                </div>

                <div class="mdc-dialog__content" id="scenario-content">
                    <div class="xs:flex w-full -ml-2 mb-2">
                        <radio v-if="scenario.is_side"
                               class="whitespace-nowrap"
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
                                 v-for="(treasure, id) in scenario.treasures.items" :key="'treasure-'+id"
                                 class="flex items-center -ml-2">
                                <checkbox-with-label
                                    :id="'treasure-'+id"
                                    :label="isNaN(id) ? id.toUpperCase() : '#' + id"
                                    :checked="scenario.isTreasureUnlocked(id)"
                                    @change="treasureChanged"></checkbox-with-label>
                                <span v-if="scenario.isTreasureUnlocked(id)" class="ml-4">
                                    <add-links-and-icons :text="treasure"/>
                                </span>
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
                                        <template v-if="questExpand[index] && !$t(quest.name).startsWith('quest')">
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
                                                <p class="mb-4">
                                                    {{ $t(quest.translationKey() + '.sections.' + n) }}
                                                </p>
                                            </template>
                                        </i18n>
                                    </div>
                                </transition-expand>
                            </template>

                            <cards v-if="scenario.hasCard()" :cards="scenario.cards"></cards>
                        </div>

                        <div class="mb-3" v-if="showNotes">
                            <button class="mdc-button normal-case -ml-2"
                                    @click="notesIsOpen = !notesIsOpen">
                                <span class="mdc-button__label font-title text-white">{{ $t('Notes') }}</span>
                                <i class="material-icons mdc-button__icon transform transition-transform duration-500 text-white"
                                   :class="{'rotate-0': notesIsOpen, 'rotate-180': !notesIsOpen}">
                                    keyboard_arrow_up
                                </i>
                            </button>

                            <transition-expand
                                :duration="{ enter: 500, leave: 800 }"
                                @after-enter="notesEntered"
                                @leave="notesLeft">
                                <div v-if="notesIsOpen" ref="notes"
                                     class="mdc-text-field mdc-text-field--textarea w-full">
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
                            </transition-expand>
                        </div>

                        <div class="relative h-8 mb-6">
                            <div class="flex absolute left-0 top-0 origin-left transform scale-75">
                                <button v-if="scenario.pages.length" class="mdc-button mdc-button--raised mr-2"
                                        @click="openPages()">
                                    <i class="material-icons mdc-button__icon">menu_book</i>
                                    <span class="mdc-button__label">{{ $t('Pages') }}</span>
                                </button>
                                <a v-if="virtualBoardUrl" :href="virtualBoardUrl" target="_blank">
                                    <button class="mdc-button mdc-button--raised">
                                        <i class="material-icons mdc-button__icon transform rotate-180">style</i>
                                        <span class="mdc-button__label">{{ $t('Virtual Board') }}</span>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </template>
                    <blockquote
                        v-if="scenario.game === 'gh' && (scenario.id === 14 || scenario.id === 43) && scenario.isComplete()"
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
                        <scenario-number :scenario="prev" v-for="prev in prevScenarios" :key="prev.id"/>
                    </div>
                    <div class="mx-auto w-20"
                         :class="{'sm:hidden': scenario.is_side, 'xs:hidden': !scenario.is_side}">
                        <webp :src="scenario.image()"
                              :animate="true"
                              :alt="scenario.name"/>
                    </div>
                    <div class="space-x-2">
                        <scenario-number :scenario="next" v-for="next in nextScenarios" :key="next.id"/>
                    </div>
                </footer>
            </template>
        </modal>
        <pages v-if="scenario" ref="pages"
               :pages="scenario.pages"
        ></pages>

        <!-- a choice is displayed after the scenario is completed, played may chose a unlocked scenario -->
        <choose v-if="scenario && scenario.choices" ref="choose"
                :scenario-ids="scenario.choices"
                @scenario-chosen="scenarioChosen"
                @closing="chooseModalClosing"
        ></choose>

        <!-- a decision-prompt is displayed before or after the scenario is played, this may influence gained achievements and rewards -->
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
import StoryRepository from "../../repositories/StoryRepository";
import Cards from "../presenters/cards/Cards";
import StorySyncer from "../../services/StorySyncer";

const md5 = require('js-md5');
const queryString = require('query-string');

export default {
    components: {Cards},
    data() {
        return {
            scenario: null,
            stateKey: 1,
            questExpand: [],
            treasuresVisible: false,
            rollback: null,
            virtualBoardUrl: null,
            notes: null,
            showNotes: false,
            notesIsOpen: false,
            scenarioRepository: new ScenarioRepository(),
            achievementRepository: new AchievementRepository(),
            choiceService: new ChoiceService(),
            preloadImage: new PreloadImage(),
            storyRepository: new StoryRepository(),
            storySyncer: new StorySyncer(),
        }
    },
    mounted() {
        this.$bus.$on('open-scenario', (data) => {
            this.open(data.id);
        });
        this.$bus.$on('close-scenario', () => {
            this.close();
        });
        this.$bus.$on('game-selected', () => {
            this.unsetScenario();
        });
    },
    computed: {
        prevScenarios() {
            return this.scenarioRepository.prevScenarios(this.scenario);
        },
        nextScenarios() {
            return this.scenarioRepository.nextScenarios(this.scenario);
        },
        achievements() {
            if (this.scenario.isComplete()) {
                let awarded = this.achievementRepository.findMany(this.scenario.achievements_awarded.merge(
                    this.scenario.achievements_from_treasures.only(this.scenario.unlockedTreasures).flatten().items
                ))
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

            if (state === ScenarioState.complete && this.scenario.prompt && this.prompt.promptAfter) {
                this.$refs['decision-prompt'].open();
            } else if (state === ScenarioState.complete && this.scenario.choices && this.scenario.choices.length > 1) {
                this.$refs['choose'].open();
            } else {
                this.scenarioRepository.changeState(this.scenario, state);
                this.$bus.$emit('scenarios-updated');
            }
        },
        notesEntered() {
            if (!this.notes && this.$refs['notes']) {
                this.notes = new MDCTextField(this.$refs['notes']);
            }
        },
        notesLeft() {
            if (this.notes) {
                this.notes.destroy();
                this.notes = null;
            }
        },
        noteChanged() {
            this.scenario.store();
            this.storySyncer.store();
        },
        treasureChanged(id, checked) {
            id = id.replace('treasure-', '');
            if (checked && this.prompt) {
                this.rollback = () => {
                    this.scenarioRepository.unlockTreasure(this.scenario, id, false);
                }
            }

            const reload = this.scenarioRepository.unlockTreasure(this.scenario, id, checked);
            if (reload) {
                this.$bus.$emit('scenarios-updated');
            }

            this.storySyncer.store();
        },
        scenarioChosen(choice) {
            this.scenarioRepository.choose(this.scenario, choice, true);

            this.storySyncer.store();

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
        async open(id) {
            await this.makeSureScenariosAreLoaded();
            const scenario = this.scenarioRepository.find(id);

            // Can't open hidden scenario's for now.
            if (!scenario || (scenario.isHidden() && !scenario.is_side)) {
                return;
            }

            this.scenario = scenario;
            this.setVirtualBoardUrl();
            this.treasuresVisible = this.scenario.lootedAllTreasures;
            this.rollback = null;
            this.notesEntered();

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

            await this.$nextTick();
            this.$refs['modal'].open();
            await this.$nextTick();

            this.$refs['pages'].preload()

            // Don't display scenario notes for unregistered users
            // This may result in unstable storyline links
            this.showNotes = app.campaignId !== 'local';
        },
        close() {
            this.notesLeft();
            this.$refs['modal'].close();
        },
        unsetScenario() {
            this.scenario = null;
        },
        openAchievement(id) {
            this.close();
            this.$bus.$emit('open-achievement', {
                id: id
            });
        },
        processPrompt() {
            return this.choiceService.getPromptConfig(this.scenario);
        },
        setVirtualBoardUrl() {
            if (!this.scenario.compatibleWithVirtualBoard()) {
                this.virtualBoardUrl = null;
                return;
            }

            const current = this.storyRepository.current();

            let query = {
                scenario: this.scenario.id,
                lockScenario: 1,
            };
            if (current) {
                query.lockRoomCode = 1;
                query.seed = parseInt(md5(current.campaignId + this.scenario.id).substr(0, 7), 16);
            }

            this.virtualBoardUrl = process.env.MIX_VIRTUAL_BOARD_URL + '?' + queryString.stringify(query);
        },
        makeSureScenariosAreLoaded() {
            return new Promise((resolve) => {
                const waitForScenarios = () => {
                    if (app.scenarios !== null) {
                        resolve();
                    } else {
                        setTimeout(waitForScenarios, 100);
                    }
                }
                waitForScenarios();
            });
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
