<template>
    <div v-if="sheet" class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Campaign sheet'), $t('Characters'), $t('Items'), $t('Buildings')]"
                  :icons="['assignment', 'person', 'style', 'home']"
                  :urls="['party', 'characters', 'items', 'home']"
                  :active="$t('Buildings')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>
            
            <buildings-section
                ref="buildings"
                :loading="loading"
                @change="store"/>

        </div>
    </div>
</template>

<script>
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetRepository from "../repositories/SheetRepository";
import BuildingsSection from "../components/presenters/party/BuildingsSection.vue";

export default {
    components: {BuildingsSection},
    mixins: [GetCampaignName],
    inject: ['appData'],
    data() {
        return {
            sheet: null,
            campaignName: null,
            loading: true,
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository
        }
    },
    mounted() {
        this.render();

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = this.sheetRepository.make(this.appData.game);
            this.campaignName = this.getCampaignName();

            await this.$nextTick();
            this.loading = false;
        },
        store() {
            if (this.loading) {
                return;
            }

            this.sheet.store();
            this.storySyncer.store();
        },
    }
}
</script>
