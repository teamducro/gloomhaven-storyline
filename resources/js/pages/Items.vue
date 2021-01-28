<template>
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div id="items" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <h1 class="mb-4 text-xl">{{ $t('Item designs') }} {{ campaignName }}</h1>

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
            shop: 0,
            items: [],
            campaignName: null,
            loading: true,
            storySyncer: new StorySyncer,
        }
    },
    watch: {
        'sheet.items': function () {
            this.items = this.calculateItems(this.sheet.items, this.sheet.prosperity)
        },
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

            this.sheet = new Sheet;
            this.shop = this.calculateShop(this.sheet.reputation);
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
        }
    }
}
</script>
