<template>
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div id="info" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <h1 class="mb-4 text-xl">{{ $t('Party sheet') }} {{ campaignName }}</h1>

            <div class="flex flex-col sm:flex-row">
                <div class="mb-8 sm:mb-0 sm:mr-4">
                    <div class="mb-2 flex items-center">
                        <h2>{{ $t('Reputation') }}</h2>
                        <rollback v-show="!loading" ref="reputation-rollback"
                                  :value.sync="sheet.reputation"></rollback>
                    </div>
                    <number-field :value.sync="sheet.reputation" :min="-20" :max="20" :id="'reputation'"
                                  @change="store"></number-field>
                </div>
                <div>
                    <h2 class="mb-2">{{ $t('Shop modifier') }}</h2>
                    <span class="font-title text-lg">{{ shop }} {{ $t('Gold') }}</span>
                    <p class="text-sm">
                        Modify the cost of items when buying by this amount.
                    </p>
                </div>
            </div>

            <div class="w-full mt-8">
                <div class="mb-2 flex items-center">
                    <h2>{{ $t('Sanctuary of the Great Oak') }}</h2>
                    <rollback v-show="!loading" ref="donations-rollback"
                              :value.sync="sheet.donations"></rollback>
                </div>
                <number-field :value.sync="sheet.donations" :min="0" :step="10" :id="'donations'"
                              @change="store"></number-field>
                <p v-if="sheet.donations <= 100" class="mt-2 text-sm">
                    When 100 gold is donated, open envelope <span class="font-title">B</span>
                </p>
                <p class="mt-2" v-if="donationProsperity">
                    <span class="font-title">{{ donationProsperity }}</span> gained prosperity checkbox by donations.
                </p>
            </div>

            <div class="w-full mt-8">
                <div class="mb-2 flex items-center">
                    <h2>{{ $t('Gloomhaven Prosperity') }}</h2>
                    <rollback v-show="!loading" ref="prosperity-rollback"
                              :value.sync="sheet.prosperityIndex"
                              @change="store"></rollback>
                </div>
                <prosperity class="-mx-2"
                            :prosperityIndex.sync="sheet.prosperityIndex"
                            :prosperity.sync="prosperity"
                            @change="store"></prosperity>
            </div>

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

            <selectable-list
                id="item-designs"
                :title="$t('Item Designs')"
                :label="$t('Add item designs')"
                :items.sync="sheet.itemDesigns"
                @change="store"
            ></selectable-list>

            <div class="lg:flex">
                <selectable-list
                    id="city-events"
                    :title="$t('City Event Decks')"
                    :label="$t('Add city events')"
                    :items.sync="sheet.city"
                    @change="store"
                ></selectable-list>
                <selectable-list
                    id="road-events"
                    :title="$t('Road Event Decks')"
                    :label="$t('Add road events')"
                    :items.sync="sheet.road"
                    @change="store"
                ></selectable-list>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Additional notes') }}</h2>
                <notes :value.sync="sheet.notes" id="notes" :label="$t('Notes')" @change="store"></notes>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Unlocks') }}</h2>
                <table class="w-full mb-4">
                    <tr v-for="(unlock, index) in unlocks" class="flex items-center border-b border-gray-600">
                        <td class="-ml-2">
                            <checkbox group="unlocks"
                                      :checked="sheet.unlocks[index]"
                                      @change="(id, isChecked) => {sheet.unlocks[index] = isChecked; store()}"></checkbox>
                        </td>
                        <td class="w-full flex flex-wrap">
                            <span class="whitespace-normal md:whitespace-no-wrap">{{ unlock.goal }}</span>
                            <span class="whitespace-normal md:whitespace-no-wrap ml-auto flex items-center text-right">
                                <span class="material-icons mr-1">remove</span>
                                <component v-bind:is="renderHtml(unlock.reward)"></component>
                            </span>
                        </td>
                    </tr>
                </table>
                <ul class="flex flex-row flex-wrap -mx-2">
                    <li v-for="(checked, character) in sheet.characters" class="flex items-center">
                        <checkbox group="items"
                                  :checked="checked"
                                  :disabled="character < 6"
                                  @change="(id, isChecked) => {sheet.characters[character] = isChecked; store()}"></checkbox>
                        <span v-if="character < 17" class="w-8 font-title">
                            <character class="w-6 -mb-2 inline-block" :character="parseInt(character)+1"/>
                        </span>
                        <span v-else class="font-title text-lg">X</span>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
import StoryRepository from "../repositories/StoryRepository";
import Sheet from "../models/Sheet";
import StorySyncer from "../services/StorySyncer";
import SelectableList from "../components/presenters/party/SelectableList";

export default {
    components: {SelectableList},
    data() {
        return {
            sheet: null,
            shop: 0,
            donationProsperity: 0,
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
                    goal: '5 “Ancient Technology” Global Achievements',
                    reward: 'Open envelope <span class="font-title">A</span>'
                },
                {
                    goal: 'Gain “The Drake’s Request” & “The Drake’s Treasure” Party Achievements',
                    reward: 'Add City Event 75 & Road Event 66'
                },
                {
                    goal: 'Donate +100 gold to the Sanctuary of the Great Oak',
                    reward: 'Open envelope <span class="font-title">B</span>'
                },
                {
                    goal: 'Have a party reputation of 10 or higher',
                    reward: 'Open envelope <character class="w-6 -mb-2 inline-block" character="11" />'
                },
                {
                    goal: 'Have a party reputation of 20',
                    reward: 'Add City Event 76 & Road Event 67'
                },
                {
                    goal: 'Have a party reputation of -10 or lower',
                    reward: 'Open envelope <character class="w-6 -mb-2 inline-block" character="12" />'
                },
                {
                    goal: 'Have a party reputation of -20',
                    reward: 'Add City Event 77 & Road Event 68'
                },
                {
                    goal: 'Retire a character',
                    reward: 'Open the Town Records Book'
                }
            ],
            campaignName: null,
            loading: true,
            storyRepository: new StoryRepository(),
            storySyncer: new StorySyncer,
        }
    },
    watch: {
        'sheet.reputation': function () {
            this.calculateShop();
        },
        'sheet.donations': function () {
            this.calculateDonationProsperity();
        }
    },
    mounted() {
        this.render();

        // this.calculateShop();
        // this.calculateDonationProsperity();

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = new Sheet;
            this.setCampaignName();

            await this.$nextTick();

            this.$refs['reputation-rollback'].reset();
            this.$refs['donations-rollback'].reset();
            this.$refs['prosperity-rollback'].reset();

            this.loading = false;
        },
        store() {
            if (this.loading) {
                return;
            }

            this.sheet.store();
            this.storySyncer.store();
        },
        calculateShop() {
            let reputation = [-18, -14, -10, -6, -2, 3, 7, 11, 15, 19];
            let shop = 5;
            reputation.forEach((r) => {
                if (this.sheet.reputation >= r) {
                    shop--;
                }
            });
            this.shop = shop;
        },
        calculateDonationProsperity() {
            let rates = [100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000];
            let donationProsperity = 0;
            rates.forEach((rate) => {
                if (this.sheet.donations >= rate) {
                    donationProsperity++;
                }
            });
            this.donationProsperity = donationProsperity;
        },
        renderHtml(html) {
            return {
                template: `<span>${html}</span>`
            };
        },
        setCampaignName() {
            const story = this.storyRepository.current()
            this.campaignName = story ? story.name : this.$t('local');
        }
    }
}
</script>
