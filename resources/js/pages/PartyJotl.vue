<template>
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div id="party" class="relative bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Party sheet')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

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
            </div>

            <div class="w-full mt-8">
                <h2 class="mb-2">{{ $t('Additional notes') }}</h2>
                <notes :value.sync="sheet.notes" id="notes" :label="$t('Notes')"
                       @change="store" :is-local-campaign="isLocalCampaign"
                ></notes>
            </div>

            <div class="w-full mt-8">
                <ul class="flex flex-row flex-wrap -mx-2">
                    <li v-for="(checked, id) in sheet.characterUnlocks" :key="id" class="flex items-center"
                        :class="'order-'+sheet.characterOrder[id]">
                        <checkbox group="items"
                                  :checked="checked"
                                  :disabled="sheet.starterCharacters.includes(id)"
                                  @change="(_, isChecked) => {sheet.characterUnlocks[id] = isChecked; store()}"></checkbox>
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
import SheetRepository from "../repositories/SheetRepository";
import PartyGh from "./PartyGh";

export default {
    extends: PartyGh,
    mixins: [GetCampaignName],
    data() {
        return {
            sheet: null,
            campaignName: null,
            loading: true,
            isLocalCampaign: true,
            game: 'jotl',
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository
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

            this.$refs['city-events']?.reset();

            this.loading = false;
        }
    }
}
</script>
