<template>
    <alchemy-section
        v-if="sheet"
        class="lg:flex-1 text-white2-87"
        ref="alchemy"
        :sheet="sheet"
        @change="store"/>
</template>

<script>

import StorySyncer from "../../services/StorySyncer";
import SheetRepository from "../../repositories/SheetRepository";

export default {
    inject: ['appData'],
    data() {
        return {
            sheet: null,
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository,
        }
    },
    mounted() {
        this.sheet = this.sheetRepository.make(this.appData.game);
    },
    methods: {
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
