<template>
    <div v-if="sheet" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div id="party" class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Party sheet')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

            <reputation-section
                ref="reputation"
                :sheet="sheet"
                :loading="loading"
                @change="store"/>
            <donations-section
                ref="donations"
                :sheet="sheet"
                :loading="loading"
                @change="store"/>
            <prosperity-section
                ref="prosperity"
                :sheet="sheet"
                :loading="loading"
                :prosperity.sync="prosperity"
                @change="store"/>

            <div class="w-full mt-8">
                <h2>{{ $t('Prosperity Items') }}</h2>
                <ul class="flex flex-row flex-wrap -mx-2">
                    <li v-for="(items, index) in prosperityItems" class="flex items-center">
                        <checkbox group="items"
                                  :disabled="true"
                                  :checked="prosperity > index"
                                  @change="store"></checkbox>
                        <span class="w-16 font-title">{{ items }}</span>
                    </li>
                </ul>
            </div>

            <router-link to="/items">
                <button class="mdc-button origin-left transform scale-90 mdc-button--raised pr-1">
                    <i class="material-icons mdc-button__icon transform rotate-180">style</i>
                    <span class="mdc-button__label">{{ $t('Items') }} 〉</span>
                </button>
            </router-link>

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
                        <button @click="draw(checkedItems, true)" :disabled="appData.read_only || !checkedItems.length"
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
                        <button @click="draw(checkedItems, false)" :disabled="appData.read_only || !checkedItems.length"
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
                <table class="w-full mb-4">
                    <tr v-for="(unlock, index) in unlocks" v-if="index < 8" :key="'unlock'+index"
                        class="flex items-center border-b border-gray-600">
                        <td class="-ml-2">
                            <checkbox group="unlocks"
                                      :id="'unlock'+index"
                                      :checked="sheet.unlocks[index]"
                                      @change="(id, isChecked) => {sheet.unlocks[index] = isChecked; store()}"></checkbox>
                        </td>
                        <td class="w-full flex items-center flex-wrap">
                            <label :for="'unlock'+index" class="whitespace-normal md:whitespace-nowrap cursor-pointer">
                                {{ unlock.goal }}
                            </label>
                            <span class="whitespace-normal md:whitespace-nowrap ml-auto flex items-center text-right">
                                <span class="material-icons mr-1">remove</span>
                                <component v-bind:is="renderHtml(unlock.reward)"></component>
                            </span>
                        </td>
                    </tr>
                    <tr class="flex items-center border-b border-gray-600">
                        <td class="-ml-2">
                            <checkbox group="unlocks" id="unlock8"
                                      :checked="sheet.unlocks[8]"
                                      @change="(id, isChecked) => {sheet.unlocks[8] = isChecked; store(); rerenderX();}"></checkbox>
                        </td>
                        <td class="w-full flex flex-wrap items-center">
                            <span class="whitespace-normal md:whitespace-nowrap">
                                {{ $t('Envelope') }} <span class="font-title">x</span> {{ $t('opened') }}
                            </span>
                        </td>
                    </tr>
                    <tr v-show="sheet.unlocks[8]" :key="'a'+renderX"
                        class="flex items-center border-b border-gray-600">
                        <td class="-ml-2">
                            <checkbox disabled="disabled" readonly="readonly"
                                      :checked="'BS' in sheet.characterUnlocks"></checkbox>
                        </td>
                        <td class="w-full flex flex-wrap">
                            <text-field class="my-2" id="x-result" :label="$t('Envelope X solution')"
                                        :value="sheet.xResult || ''" :max="10"
                                        @change="xResultChanged"></text-field>
                        </td>
                    </tr>
                </table>

                <unlock-characters :sheet="sheet" @change="store" :key="'b'+renderX"/>
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

export default {
    mixins: [GetCampaignName, SheetCalculations],
    inject: ['appData'],
    data() {
        return {
            sheet: null,
            prosperity: 1,
            prosperityItems: [
                '001–014',
                '015–021',
                '022–028',
                '029–035',
                '036–042',
                '043–049',
                '050–056',
                '057–063',
                '064–070'
            ],
            unlocks: [
                {
                    goal: this.$t('5 Ancient Technology Global Achievements'),
                    reward: this.$t('Open envelope') + ' <span class="font-title">A</span>'
                },
                {
                    goal: this.$t('Gain The Drakes Command & The Drakes Treasure Party Achievements'),
                    reward: this.$t('Add City Event 75 & Road Event 66') + '<br>' + this.$t('and gain The Drake Aided global achievement')
                },
                {
                    goal: this.$t('Donate +100 gold to the Sanctuary of the Great Oak'),
                    reward: this.$t('Open envelope') + ' <span class="font-title">B</span>'
                },
                {
                    goal: this.$t('Have a party reputation of 10 or higher'),
                    reward: this.$t('Open box') + ' <character-icon class="w-6 -mb-2 inline-block" character="SK" />'
                },
                {
                    goal: this.$t('Have a party reputation of 20'),
                    reward: this.$t('Add City Event 76 & Road Event 67')
                },
                {
                    goal: this.$t('Have a party reputation of -10 or lower'),
                    reward: this.$t('Open box') + ' <character-icon class="w-6 -mb-2 inline-block" character="NS" />'
                },
                {
                    goal: this.$t('Have a party reputation of -20'),
                    reward: this.$t('Add City Event 77 & Road Event 68')
                },
                {
                    goal: this.$t('Retire a character'),
                    reward: this.$t('Open the Town Records Book')
                }
            ],
            campaignName: null,
            loading: true,
            isLocalCampaign: true,
            renderX: 0,
            game: 'gh',
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
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
        this.$bus.$off('remove-card', this.removeCard);
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = this.sheetRepository.make(this.appData.game);
            this.campaignName = this.getCampaignName();

            this.isLocalCampaign = app.campaignId === 'local';

            await this.$nextTick();

            this.$refs['reputation']?.reset();
            this.$refs['donations']?.reset();
            this.$refs['prosperity']?.reset();
            this.$refs['city-events']?.reset();
            this.$refs['road-events']?.reset();

            this.loading = false;
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
        },
        async xResultChanged(xResult) {
            this.sheet.xResult = xResult;
            this.store();
            await this.$nextTick();
            this.sheet.fillCharacterUnlocks();
            await this.$nextTick();
            this.rerenderX();
        },
        rerenderX() {
            this.renderX++;
        }
    }
}
</script>
