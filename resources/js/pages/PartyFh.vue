<template>
    <div v-if="sheet" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div id="party" class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Campaign sheet'), $t('Characters'), $t('Items'), $t('Buildings')]"
                  :icons="['assignment', 'person', 'style', 'home']"
                  :urls="['party', 'characters', 'items', 'buildings']"
                  :active="$t('Campaign sheet')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

            <calendar-section
                ref="calendar"
                :calendar.sync="sheet.calendar"
                :loading="loading"
                @change="store"
            />

            <div class="mt-4 flex flex-wrap">
                <div class="md:flex-1">
                    <div class="xs:grid xs:grid-cols-3">
                        <morale-section ref="morale" :sheet="sheet" :loading="loading" @change="store" />
                    </div>

                    <resources-section
                        ref="resources"
                        :resources.sync="sheet.resources"
                        :loading="loading"
                        @change="store"/>

                    <div class="mt-4 grid grid-cols-2 xs:grid-cols-3 gap-4">
                        <counter-section
                            ref="inspiration"
                            :title="$t('Inspiration')"
                            :value.sync="sheet.inspiration"
                            :loading="loading"
                            @change="store"/>

                        <counter-section
                            ref="total-defense"
                            :title="$t('Total Defense')"
                            :value.sync="sheet.totalDefense"
                            :loading="loading"
                            @change="store"/>

                        <soldiers-section
                            ref="soldiers"
                            :sheet="sheet"
                            :loading="loading"
                            @change="store"/>
                    </div>

                    <alchemy-section
                        class="lg:flex-1 text-white2-87"
                        ref="alchemy"
                        :sheet="sheet"
                        @change="store"/>
                </div>

                <div class="mt-4 md:flex-1 flex flex-col">
                    <town-guard-perks :checks.sync="sheet.checks"
                                  :perks.sync="sheet.perks"
                                  :sheet="sheet"
                                  @change="store"/>

                    <town-guard-modifier-deck :perks="sheet.perks"
                                              :perkDescriptions="sheet.perkDescriptions"/>
                </div>
            </div>

            <prosperity-section
                ref="prosperity"
                :sheet="sheet"
                :loading="loading"
                :prosperity.sync="prosperity"
                @change="store"/>

            <checkbox-with-label
                id="toggle-season-events"
                class="mt-8"
                :checked.sync="showOtherSeasonEvents"
                :label="isSummer ? $t('Show winter events') : $t('Show summer events')"
            />

            <div class="lg:flex" v-if="isSummer || showOtherSeasonEvents">
                <selectable-list
                    id="summer-outpost-events"
                    :title="$t('Summer Outpost Event Decks')"
                    :label="$t('Add summer outpost events')"
                    :items.sync="sheet.summerOutpost"
                    @change="store"
                    ref="summer-outpost-events"
                >
                    <template slot="after-field" slot-scope="{checkedItems}">
                        <button @click="draw(checkedItems, 'SO')" :disabled="appData.read_only || !checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
                <selectable-list
                    id="summer-road-events"
                    :title="$t('Summer Road Event Decks')"
                    :label="$t('Add summer road events')"
                    :items.sync="sheet.summerRoad"
                    @change="store"
                    ref="summer-road-events"
                >
                    <template slot="after-field" slot-scope="{checkedItems}">
                        <button @click="draw(checkedItems, 'SR')" :disabled="appData.read_only || !checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
                <selectable-list
                    v-if="boatBuilt && isSummer"
                    id="boat-events"
                    :title="$t('Boat Event Decks')"
                    :label="$t('Add boat events')"
                    :items.sync="sheet.boat"
                    @change="store"
                    ref="boat-events"
                >
                    <template slot="after-field" slot-scope="{checkedItems}">
                        <button @click="draw(checkedItems, 'B')" :disabled="appData.read_only || !checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
            </div>

            <div class="lg:flex" v-if="!isSummer || showOtherSeasonEvents">
                <selectable-list
                    id="winter-outpost-events"
                    :title="$t('Winter Outpost Event Decks')"
                    :label="$t('Add winter outpost events')"
                    :items.sync="sheet.winterOutpost"
                    @change="store"
                    ref="winter-outpost-events"
                >
                    <template slot="after-field" slot-scope="{checkedItems}">
                        <button @click="draw(checkedItems, 'WO')" :disabled="appData.read_only || !checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
                <selectable-list
                    id="winter-road-events"
                    :title="$t('Winter Road Event Decks')"
                    :label="$t('Add winter road events')"
                    :items.sync="sheet.winterRoad"
                    @change="store"
                    ref="winter-road-events"
                >
                    <template slot="after-field" slot-scope="{checkedItems}">
                        <button @click="draw(checkedItems, 'WR')" :disabled="appData.read_only || !checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
                <selectable-list
                    v-if="boatBuilt && !isSummer"
                    id="boat-events"
                    :title="$t('Boat Event Decks')"
                    :label="$t('Add boat events')"
                    :items.sync="sheet.boat"
                    @change="store"
                    ref="boat-events"
                >
                    <template slot="after-field" slot-scope="{checkedItems}">
                        <button @click="draw(checkedItems, 'B')" :disabled="appData.read_only || !checkedItems.length"
                                class="ml-4 mdc-button origin-left transform scale-90 mdc-button--raised">
                            <i class="material-icons mdc-button__icon">launch</i>
                            <span class="mdc-button__label">{{ $t('Draw') }}</span>
                        </button>
                    </template>
                </selectable-list>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Scenario level') }}</h2>
                <scenario-level :value.sync="sheet.scenarioLevel" id="scenario-level"
                                @change="store" :characters="sheet.characters"
                ></scenario-level>
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Additional notes') }}</h2>
                <notes :value.sync="sheet.notes" id="notes" :label="$t('Notes')"
                       @change="store" :is-local-campaign="isLocalCampaign"
                ></notes>
            </div>

            <div class="w-full mt-8">
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
import OverlayRepository from "../repositories/OverlayRepository";
import BuildingRepository from "../repositories/BuildingRepository";

export default {
    mixins: [GetCampaignName, SheetCalculations],
    inject: ['appData'],
    data() {
        return {
            sheet: null,
            prosperity: 1,
            campaignName: null,
            loading: true,
            isLocalCampaign: true,
            renderX: 0,
            showOtherSeasonEvents: false,
            alchemist: null,
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository,
            scenarioRepository: new ScenarioRepository,
            buildingRepository: new BuildingRepository,
            overlayRepository: new OverlayRepository,
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
    computed: {
        isSummer() {
            return this.sheet?.isSummer();
        },
        boatBuilt() {
            return this.overlayRepository.find('A')?.present;
        }
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = this.sheetRepository.make(this.appData.game);
            this.alchemist = this.buildingRepository.findName('Alchemist');
            this.campaignName = this.getCampaignName();

            this.isLocalCampaign = app.campaignId === 'local';

            await this.$nextTick();

            this.$refs['resources']?.reset();
            this.$refs['morale']?.reset();
            this.$refs['inspiration']?.reset();
            this.$refs['total-defense']?.reset();
            this.$refs['soldiers']?.reset();
            this.$refs['prosperity']?.reset();
            this.$refs['summer-road-events']?.reset();
            this.$refs['summer-outpost-events']?.reset();
            this.$refs['winter-road-events']?.reset();
            this.$refs['winter-outpost-events']?.reset();
            this.$refs['boat-events']?.reset();

            this.loading = false;
        },
        store() {
            if (this.loading) {
                return;
            }

            this.sheet.store();
            this.storySyncer.store();
        },
        draw(checkedItems, type) {
            let id = checkedItems[Math.floor(Math.random() * checkedItems.length)];
            if (id) {
                const card = type + '-' + id;
                this.$bus.$emit('open-event-card', {id: card, game: this.appData.game});
            }
        },
        openBuilding(building) {
            this.$bus.$emit('open-building-card', building);
        },
        removeCard(card) {
            this.sheet[card.folder][card.id] = false;
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
