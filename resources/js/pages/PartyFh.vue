<template>
    <div v-if="sheet" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div id="party" class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Campaign sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Campaign sheet')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

            <resources-section
                ref="resources"
                :resources.sync="sheet.resources"
                :loading="loading"
                @change="store"/>

            <div class="mt-4 flex flex-wrap">
                <counter-section
                    class="mb-4 mr-4"
                    ref="inspiration"
                    :title="$t('Inspiration')"
                    :value.sync="sheet.inspiration"
                    :loading="loading"
                    @change="store"/>

                <counter-section
                    class="mb-4 mr-4"
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
                        <button @click="draw(checkedItems, 'C')" :disabled="appData.read_only || !checkedItems.length"
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
                        <button @click="draw(checkedItems, 'R')" :disabled="appData.read_only || !checkedItems.length"
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

        </div>
    </div>
</template>

<script>
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetCalculations from "../services/SheetCalculations";
import SheetRepository from "../repositories/SheetRepository";
import ScenarioRepository from "../repositories/ScenarioRepository";
import ResourcesSection from "../components/presenters/party/ResourcesSection.vue";

export default {
    components: {ResourcesSection},
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
            campaignName: null,
            loading: true,
            isLocalCampaign: true,
            renderX: 0,
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

            this.$refs['resources']?.reset();
            this.$refs['morale']?.reset();
            this.$refs['inspiration']?.reset();
            this.$refs['total-defense']?.reset();
            this.$refs['soldiers']?.reset();
            this.$refs['prosperity']?.reset();
            // this.$refs['summer-road']?.reset();
            // this.$refs['summer-outpost']?.reset();
            // this.$refs['winter-road']?.reset();
            // this.$refs['winter-outpost']?.reset();

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
