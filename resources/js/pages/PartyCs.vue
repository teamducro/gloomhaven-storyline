<template>
    <div v-if="sheet" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div id="party" class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Party sheet')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

            Party sheet is in working progress.

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Unlocks') }}</h2>

                <ul class="flex flex-row flex-wrap -mx-2">
                    <li v-for="(checked, id) in sheet.characterUnlocks" :key="id" class="flex items-center"
                        :class="'order-'+sheet.characterOrder[id]">
                        <checkbox group="items"
                                  :id="'character-'+id"
                                  :checked="checked"
                                  :disabled="sheet.starterCharacters.includes(id)"
                                  @change="(_, isChecked) => {unlockCharacter(id, isChecked)}"></checkbox>
                        <span class="w-8 font-title">
                            <character-icon class="w-6 -mb-2 inline-block" :character="id"/>
                        </span>
                    </li>
                </ul>
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
    data() {
        return {
            sheet: null,
            campaignName: null,
            loading: true,
            isLocalCampaign: true,
            game: 'cs',
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

            this.sheet = this.sheetRepository.make(app.game);
            this.campaignName = this.getCampaignName();

            this.isLocalCampaign = app.campaignId === 'local';

            await this.$nextTick();

            // this.$refs['city-events']?.reset();
            // this.$refs['road-events']?.reset();

            this.loading = false;
        },
        unlockCharacter(id, isChecked) {
            this.sheet.characterUnlocks[id] = isChecked;
            this.sheet.store();
            this.scenarioRepository.scenarioValidator.validate();
            this.store();
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
