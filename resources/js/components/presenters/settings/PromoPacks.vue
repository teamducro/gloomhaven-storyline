<template>
    <div v-if="sheet" id="promo-packs"
         class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
        <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
            <i class="material-icons mr-4" aria-hidden="true">redeem</i>
            {{ $t('promo-packs.title') }}
        </h1>

        <p class="text-base">
            {{ $t('promo-packs.conquests-text') }}
        </p>

        <checkbox-with-label id="conquests-enabled"
                             class="my-2"
                             :label="$t('promo-packs.conquests')"
                             v-model:checked="sheet.conquestsEnabled"
                             @change="store"/>
    </div>
</template>

<script>
import SheetRepository from "../../../repositories/SheetRepository";
import StorySyncer from "../../../services/StorySyncer";
import {Game} from "../../../models/Game";

// Games whose personal quest deck the ConQuests promo pack can be shuffled into.
const conquestsGames = [Game.gh, Game.fc, Game.fh];

export default {
    inject: ['appData'],
    data() {
        return {
            sheet: null,
        }
    },
    beforeMount() {
        this.init();
    },
    mounted() {
        this.$bus.$on('campaigns-changed', this.init);
    },
    unmounted() {
        this.$bus.$off('campaigns-changed', this.init);
    },
    methods: {
        // Rebuild from the current campaign data: storing a stale sheet would overwrite a restored
        // snapshot, another campaign, or a teammate's synced changes.
        init() {
            this.sheet = conquestsGames.includes(this.appData.game)
                ? new SheetRepository().make(this.appData.game)
                : null;
        },
        store() {
            this.sheet.store();
            new StorySyncer().store();
        }
    }
}
</script>
