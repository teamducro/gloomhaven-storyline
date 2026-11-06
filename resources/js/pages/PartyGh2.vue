<template>
    <div v-if="sheet" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div id="party" class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Campaign sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Campaign sheet')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

            <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <counter-section
                    ref="inspiration"
                    :title="$t('Inspiration')"
                    v-model:value="sheet.inspiration"
                    :loading="loading"
                    @change="store"/>
                <counter-section
                    ref="demons"
                    :title="$t('Demons')"
                    v-model:value="sheet.factionReputation.demons"
                    :min="-10"
                    :max="maxReputation('demons')"
                    :loading="loading"
                    @change="factionChanged"/>
                <counter-section
                    ref="merchant-guild"
                    :title="$t('Merchant\'s Guild')"
                    v-model:value="sheet.factionReputation['merchant-guild']"
                    :min="-10"
                    :max="maxReputation('merchant-guild')"
                    :loading="loading"
                    @change="factionChanged"/>
                <counter-section
                    ref="military"
                    :title="$t('Military')"
                    v-model:value="sheet.factionReputation.military"
                    :min="-10"
                    :max="maxReputation('military')"
                    :loading="loading"
                    @change="factionChanged"/>
            </div>

            <donations-section
                ref="donations"
                :sheet="sheet"
                :loading="loading"
                :threshold="0"
                @change="prosperityChanged"/>

            <prosperity-section
                ref="prosperity"
                :sheet="sheet"
                :loading="loading"
                v-model:prosperity="prosperity"
                @change="prosperityChanged"/>
            <p v-if="prosperitySectionsReached.length" class="mt-2 text-sm">
                {{ $t('Read section') }} {{ prosperitySectionsReached.join(', ') }}
            </p>

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
                    <span class="mdc-button__ripple"></span>
                    <i class="material-icons mdc-button__icon transform rotate-180">style</i>
                    <span class="mdc-button__label">{{ $t('Items') }} 〉</span>
                </button>
            </router-link>

            <div class="w-full mt-8">
                <counter-section
                    ref="imbuement"
                    :title="$t('Imbuement')"
                    :min="0"
                    :max="80"
                    v-model:value="sheet.imbuement"
                    :loading="loading"
                    @change="store"/>
                <p class="mt-2 text-sm" v-if="sheet.imbuement >= 5">
                    <span class="font-title">{{ Math.floor(sheet.imbuement / 5) }}</span>
                    {{ $t('gained prosperity checkboxes by imbuement.') }}
                </p>
                <p class="mt-2 text-sm" v-if="imbuementSectionsReached.length">
                    {{ $t('Read section') }} {{ imbuementSectionsReached.join(', ') }}
                </p>
            </div>

            <div class="lg:flex">
                <selectable-list
                    id="city-events"
                    :title="$t('City Event Decks')"
                    :label="$t('Add city events')"
                    v-model:items="sheet.city"
                    @change="store"
                    @view="(item) => openCard(item, 'C')"
                    ref="city-events"
                >
                    <template #after-field="{checkedItems}">
                        <button @click="draw(checkedItems, 'C')" :disabled="appData.read_only || !checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__ripple"></span>
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
                <selectable-list
                    id="road-events"
                    :title="$t('Road Event Decks')"
                    :label="$t('Add road events')"
                    v-model:items="sheet.road"
                    @change="store"
                    @view="(item) => openCard(item, 'R')"
                    ref="road-events"
                >
                    <template #after-field="{checkedItems}">
                        <button @click="draw(checkedItems, 'R')" :disabled="appData.read_only || !checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <span class="mdc-button__ripple"></span>
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Scenario level') }}</h2>
                <scenario-level v-model:value="sheet.scenarioLevel" id="scenario-level"
                                @change="store" :characters="sheet.characters"
                ></scenario-level>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Additional notes') }}</h2>
                <notes v-model:value="sheet.notes" id="notes" :label="$t('Notes')"
                       @change="store" :is-local-campaign="isLocalCampaign"
                ></notes>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Unlocks') }}</h2>
                <table class="w-full mb-4">
                    <tr v-for="(unlock, index) in unlocks" :key="'unlock'+index"
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
                                <span class="material-icons mr-1">remove</span>{{ unlock.reward }}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Classes unlocked') }}</h2>
                <unlock-characters :sheet="sheet" @changed="classUnlocked"/>
                <p class="mt-2 text-sm">{{ $t('Unlocking a class adds its events to the event decks.') }}</p>
            </div>

        </div>
    </div>
</template>

<script>
import PartyGh from "./PartyGh";
import AchievementRepository from "../repositories/AchievementRepository";
import GameData from "../services/GameData";

// Campaign sheet rules (reputation and prosperity events, sections, unlocks) live in `sections` of gh2.json.
const sections = new GameData().sectionsGh2();
const factionNames = {demons: 'Demons', 'merchant-guild': 'Merchant\'s Guild', military: 'Military'};

export default {
    extends: PartyGh,
    data() {
        return {
            prosperityItems: ['001–016', '017–024', '025–032', '033–040', '041–048', '049–053', '054–058', '059–063', '064–068'],
            prosperitySections: sections.prosperitySections,
            imbuementSections: sections.imbuementSections,
            unlocks: sections.unlocks.map(unlock => ({goal: this.unlockGoal(unlock), reward: this.unlockReward(unlock)})),
        }
    },
    computed: {
        prosperitySectionsReached() {
            return collect(this.prosperitySections).filter((section, index) => this.sheet.effectiveProsperityIndex >= index).values().all();
        },
        imbuementSectionsReached() {
            return collect(this.imbuementSections).filter((section, boxes) => this.sheet.imbuement >= boxes).values().all();
        },
    },
    methods: {
        // Above 12 once the faction's sheet unlock is checked.
        maxReputation(faction) {
            const index = sections.unlocks.findIndex(unlock => unlock.faction === faction && unlock.maxReputation);
            return this.sheet.unlocks[index] ? sections.unlocks[index].maxReputation : 12;
        },
        unlockGoal({goal, faction, reputation, scenarios}) {
            if (goal) {
                return this.$t(goal);
            }

            return [this.$t(factionNames[faction]), reputation, scenarios && '+ ' + this.$t('Scenario') + ' ' + scenarios]
                .filter(Boolean).join(' ');
        },
        unlockReward({reward, section}) {
            return reward ? this.$t(reward) : this.$t('Read section') + ' ' + section;
        },
        async render() {
            this.loading = true;

            this.sheet = this.sheetRepository.make(this.appData.game);
            this.campaignName = this.getCampaignName();

            this.isLocalCampaign = app.campaignId === 'local';
            this.lastProsperityIndex = this.sheet.effectiveProsperityIndex;

            await this.$nextTick();

            ['inspiration', 'demons', 'merchant-guild', 'military', 'prosperity', 'imbuement', 'donations', 'city-events', 'road-events']
                .forEach(ref => this.$refs[ref]?.reset());

            this.loading = false;
        },
        factionChanged() {
            if (!this.loading) {
                // C-57 joins the city deck the first time any faction reaches 13 (errata).
                const {unlock, reputation, events} = sections.anyFactionReputation;
                if (!this.sheet.unlocks[unlock] && Object.values(this.sheet.factionReputation).some(value => value >= reputation)) {
                    this.sheet.unlocks[unlock] = true;
                    this.sheet.addEvents(events);
                }

                sections.reputation9Events.forEach(([faction, unlock, events]) => {
                    if (!this.sheet.unlocks[unlock] && this.sheet.factionReputation[faction] >= 9) {
                        this.sheet.unlocks[unlock] = true;
                        this.sheet.addEvents(events);
                    }
                });

                // Gain only: once the section is read, losing reputation doesn't re-lock its scenarios.
                const achievementRepository = new AchievementRepository();
                const reached = sections.reputationAchievements.filter(([faction, value, id]) => !achievementRepository.find(id)?.awarded
                    && Object.entries(this.sheet.factionReputation).some(([f, v]) => (!faction || f === faction) && v >= value));
                reached.forEach(([, , id]) => achievementRepository.gain(id));
                if (reached.length) {
                    this.scenarioRepository.scenarioValidator.validate();
                }
            }

            this.store();
        },
        prosperityChanged() {
            // Only when crossing the box: the sections have no sheet checkbox to remember they were read.
            Object.entries(sections.prosperityEvents)
                .filter(([box]) => this.lastProsperityIndex < box && this.sheet.effectiveProsperityIndex >= box)
                .forEach(([, events]) => this.sheet.addEvents(events));
            this.lastProsperityIndex = this.sheet.effectiveProsperityIndex;

            this.store();
        },
        classUnlocked(id, isChecked) {
            if (!isChecked || this.loading) {
                return;
            }

            // UnlockCharacters added the class events
            this.store();
        },
    }
}
</script>
