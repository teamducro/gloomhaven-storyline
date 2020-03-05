<template>
    <div>
        <modal ref="modal">
            <template v-slot:body v-if="scenario">
                <div id="scenario-title" class="pl-6 border-b border-white2-25"
                     :class="{'pb-2': scenario.chapter, 'pb-4': !scenario.chapter}">
                    <h2 class="mdc-dialog__title p-0 leading-none">{{ scenario.name }}
                        <button type="button" data-mdc-dialog-action="close"
                                class="mdc-button absolute right-0 top-0 mt-4">
                            <i class="material-icons">close</i>
                        </button>
                    </h2>
                    <span v-if="scenario.chapter_name" class="text-xs uppercase text-white2-50 font-bold">{{ scenario.chapter_name }}</span>
                </div>

                <div class="mdc-dialog__content" id="scenario-content">
                    <div class="flex w-full mb-2">
                        <radio id="incomplete" group="states" label="Incomplete"
                               :key="'incomplete-' + stateKey"
                               :checked="scenario.isIncomplete()"
                               :disabled="scenario.isBlocked() || scenario.isRequired()"
                               @changed="stateChanged"
                        ></radio>
                        <radio id="complete" group="states" label="Complete"
                               :key="'complete-' + stateKey"
                               :checked="scenario.isComplete()"
                               :disabled="scenario.isBlocked() || scenario.isRequired()"
                               @changed="stateChanged"
                        ></radio>
                        <div class="hidden xs:block ml-auto w-20">
                            <webp :src="'/img/scenarios/' + scenario.id + '.png'"
                                  :animate="true"
                                  :alt="scenario.name"></webp>
                        </div>
                    </div>

                    <div v-if="scenario.requirments" class="mb-2 flex items-center" style="padding-left: 7px;">
                        <i v-if="scenario.isRequired() || scenario.isBlocked()"
                           class="material-icons text-incomplete text-2xl mr-2">highlight_off</i>
                        <i v-else class="material-icons text-complete text-2xl mr-2">check_circle_outline</i>
                        Requirments: {{ scenario.requirments }}
                    </div>

                    <div class="mb-3 flex flex-col items-start">
                        <template v-for="(quest, index) in scenario.quests">
                            <button class="mdc-button"
                                    @click="toggleQuest(index)">
                                <i class="material-icons mdc-button__icon">notes</i>
                                <span class="mdc-button__label">{{ quest.name }}</span>
                                <i class="material-icons mdc-button__icon transition-transform duration-500"
                                   :class="{'rotate-0': questExpand[index], 'rotate-180': !questExpand[index]}">
                                    keyboard_arrow_up
                                </i>
                            </button>
                            <transition-expand>
                                <div v-if="questExpand[index]">
                                    <p class="pb-3" v-html="quest.stages[quest.stage]"></p>
                                </div>
                            </transition-expand>
                        </template>
                    </div>

                    <div class="mb-6" v-if="scenario.treasures.isNotEmpty()">
                        <h2 class="text-white" style="padding-left: 12px;">Treasures</h2>
                        <div v-for="(treasure, id) in scenario.treasures.items" :key="id"
                             class="flex items-center">
                            <checkbox
                                    :id="id"
                                    :label="'#' + id"
                                    :checked="scenario.isTreasureUnlocked(id)"
                                    @changed="treasureChanged"></checkbox>
                            <span v-if="scenario.isTreasureUnlocked(id)" class="ml-4">{{ treasure }}</span>
                        </div>
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
                            <span class="mdc-button__label">Pages</span>
                        </button>
                        <div class="xs:hidden ml-auto w-20">
                            <webp :src="'/img/scenarios/' + scenario.id + '.png'"
                                  :animate="true"
                                  :alt="scenario.name"></webp>
                        </div>
                    </div>

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
    import {MDCTextField} from "@material/textfield/component";
    import {ScenarioState} from "../models/ScenarioState";
    import Checkbox from "./Checkbox";

    export default {
        components: {Checkbox},
        data() {
            return {
                scenario: null,
                notes: null,
                stateKey: 1,
                questExpand: [],
                scenarioRepository: new ScenarioRepository()
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
                } else {
                    return null;
                }
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
                this.questExpand = new Array(this.scenario.quests.length);
                this.rerenderStateSelection();
                this.$nextTick(() => {
                    this.$refs['modal'].open();
                    this.$nextTick(() => {
                        new MDCTextField(this.$refs['notes']);
                    });
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
