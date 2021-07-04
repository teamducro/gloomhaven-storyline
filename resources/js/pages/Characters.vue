<template>
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div id="characters" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Characters')"
            />
            <h1 class="hidden sm:inline text-xl">{{ campaignName }}</h1>

        </div>
    </div>
</template>

<script>
import Sheet from "../models/Sheet";
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetCalculations from "../services/SheetCalculations";

export default {
    mixins: [GetCampaignName, SheetCalculations],
    data() {
        return {
            sheet: null,
            campaignName: null,
            loading: true,
            renderX: 0,
            storySyncer: new StorySyncer,
        }
    },
    watch: {},
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

            this.sheet = new Sheet;
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
        renderHtml(html) {
            return {
                template: `<span>${html}</span>`
            };
        },
        rerenderX() {
            this.renderX++;
        }
    }
}
</script>
