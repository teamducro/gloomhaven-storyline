<template>
    <div v-if="sheet && !loading" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div id="party" class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Party sheet')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

            Party sheet is in working progress.

            <reputation-section
                ref="reputation"
                :sheet="sheet"
                :loading="loading"
                @change="store"/>
            <donations-section
                ref="donations"
                :sheet="sheet"
                :loading="loading"
                :threshold="0"
                @change="store"/>
            <prosperity-section
                ref="prosperity"
                :sheet="sheet"
                :loading="loading"
                :prosperity.sync="prosperity"
                @change="store"/>

            <div class="lg:flex">
                <selectable-list
                    id="city-events"
                    :title="$t('City Event Decks')"
                    :label="$t('Add city events')"
                    :items.sync="sheet.city"
                    @change="store"
                    ref="city-events"
                >
                    <template slot="after-field" slot-scope="{checkedItems}">
                        <button @click="draw(checkedItems, true)" :disabled="!checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
                <selectable-list
                    id="road-events"
                    :title="$t('Road Event Decks')"
                    :label="$t('Add road events')"
                    :items.sync="sheet.road"
                    @change="store"
                    ref="road-events"
                >
                    <template slot="after-field" slot-scope="{checkedItems}">
                        <button @click="draw(checkedItems, false)" :disabled="!checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Additional notes') }}</h2>
                <notes :value.sync="sheet.notes" id="notes" :label="$t('Notes')"
                       @change="store" :is-local-campaign="isLocalCampaign"
                ></notes>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Unlocks') }}</h2>

                <p>
                    {{
                        $t('Every time your party successfully completes five scenarios, check any one of the boxes and gain the corresponding reward.')
                    }}</p>
                <p>
                    {{ completedCount }} {{ $t('completed scenarios') }},
                    {{ unlockCount }} {{ $t('unlocked') }}.
                </p>

                <div class="w-full mb-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                    <div v-for="(unlock, index) in unlocks" :key="'unlock'+index"
                         class="flex items-center border-b border-gray-600">
                        <div class="-ml-2">
                            <checkbox group="unlocks"
                                      :id="'unlock'+index"
                                      :checked="sheet.unlocks[index]"
                                      @change="(_, isChecked) => {unlockChecked(index, isChecked)}"></checkbox>
                        </div>
                        <div class="w-full flex items-center flex-wrap">
                            <label :for="'unlock'+index" class="cursor-pointer">
                                <component v-bind:is="renderHtml(unlock.reward)"></component>
                            </label>
                            <scenario-number class="ml-2" v-if="unlock.scenario"
                                             :id="unlock.scenario"
                                             show-name/>
                        </div>
                    </div>
                </div>

                <unlock-characters :sheet="sheet" @change="store"/>
            </div>

        </div>
    </div>
</template>

<script>
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetCalculations from "../services/SheetCalculations";
import SheetRepository from "../repositories/SheetRepository";
import ScenarioRepository from "../repositories/ScenarioRepository";
import ScenarioNumber from "../components/elements/ScenarioNumber";
import {ScenarioState} from "../models/ScenarioState";

export default {
    components: {ScenarioNumber},
    mixins: [GetCampaignName, SheetCalculations],
    data() {
        return {
            sheet: null,
            campaignName: null,
            prosperity: 0,
            loading: true,
            isLocalCampaign: true,
            game: 'cs',
            unlocks: [
                {
                    reward: 'Gain +3 Prosperity'
                },
                {
                    reward: 'Add City and Road Event 59 to the top of the corresponding decks'
                },
                {
                    reward: 'Gain +3 Prosperity'
                },
                {
                    reward: 'Add City and Road Event 60 to the top of the corresponding decks'
                },
                {
                    reward: 'Gain +3 Prosperity'
                },
                {
                    reward: 'Unlock',
                    scenario: 51
                },
                {
                    reward: 'Gain +3 Prosperity'
                },
                {
                    reward: 'Unlock',
                    scenario: 52
                },
                {
                    reward: 'Gain +3 Prosperity'
                },
                {
                    reward: 'Unlock',
                    scenario: 53
                },
                {
                    reward: 'Gain +3 Prosperity'
                },
                {
                    reward: 'Unlock',
                    scenario: 54
                },
                {
                    reward: 'Gain +3 Prosperity'
                },
                {
                    reward: 'Unlock',
                    scenario: 55
                }
            ],
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository,
            scenarioRepository: new ScenarioRepository
        }
    },
    mounted() {
        this.render();

        this.$bus.$on('campaigns-changed', this.render);
        this.$bus.$on('remove-card', this.removeCard);
    },
    computed: {
        completedCount() {
            return this.scenarioRepository.whereState(ScenarioState.complete).count();
        },
        unlockCount() {
            return parseInt(this.completedCount / 5) + 1
        }
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
        this.$bus.$off('remove-card', this.removeCard);
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = this.sheetRepository.make(app.game);
            this.campaignName = this.getCampaignName();

            this.isLocalCampaign = app.campaignId === 'local';

            await this.$nextTick();

            // this.$refs['city-events']?.reset();
            // this.$refs['road-events']?.reset();

            this.loading = false;
        },
        unlockChecked(index, isChecked) {
            if (this.unlocks[index].scenario) {
                const state = isChecked
                    ? ScenarioState.incomplete
                    : ScenarioState.hidden;
                this.scenarioRepository.changeState(this.unlocks[index].scenario, state);
            }
            this.sheet.unlocks[index] = isChecked;
            this.store()
        },
        store() {
            if (this.loading) {
                return;
            }

            this.sheet.store();
            this.storySyncer.store();
        },
        draw(checkedItems, isCity = true) {
            let id = checkedItems[Math.floor(Math.random() * checkedItems.length)];
            if (id) {
                const card = (isCity ? 'C' : 'R') + '-' + id;
                this.$bus.$emit('open-event-card', {id: card, game: this.game});
            }
        },
        removeCard(card) {
            const type = card.type === 'R' ? 'road' : 'city';
            this.sheet[type][card.id] = false;

            this.store();
        },
        renderHtml(html) {
            return {
                template: `<span>${html}</span>`
            };
        }
    }
}
</script>
