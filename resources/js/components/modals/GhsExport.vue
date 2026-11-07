<template>
    <modal ref="modal" :title="$t('ghs-export.title')">
        <template v-slot:content>
            <p class="mb-2">{{ $t('ghs-export.1') }}</p>
            <ol class="list-decimal ml-6 mb-4">
                <li>{{ $t('ghs-export.2') }}</li>
                <li>{{ $t('ghs-export.3') }}</li>
                <li>{{ $t('ghs-export.4') }}</li>
            </ol>

            <a id="ghs-download" :href="downloadUrl" download="gloomhaven-storyline-ghs.json">
                <button type="button" class="mdc-button mdc-button--raised">
                    <i class="material-icons mdc-button__icon">launch</i>
                    <span class="mdc-button__label">{{ $t('Download') }}</span>
                </button>
            </a>
        </template>
    </modal>
</template>

<script>
import GhsExport from "../../services/GhsExport";
import SheetRepository from "../../repositories/SheetRepository";
import ScenarioRepository from "../../repositories/ScenarioRepository";

export default {
    inject: ['appData'],
    data() {
        return {
            downloadUrl: '',
        }
    },
    mounted() {
        this.$bus.$on('open-ghs-export-modal', this.open);
    },
    unmounted() {
        this.$bus.$off('open-ghs-export-modal', this.open);
    },
    methods: {
        open(scenarioId) {
            const sheet = new SheetRepository().make(this.appData.game);
            const scenario = new ScenarioRepository().find(scenarioId);
            const state = new GhsExport().make(sheet, this.appData.game, scenario);

            this.downloadUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
            this.$refs['modal'].open();
        }
    }
}
</script>
