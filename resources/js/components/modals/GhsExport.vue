<template>
    <modal ref="modal" :title="$t('ghs-export.title')">
        <template v-slot:content>
            <p class="mb-2">{{ $t('ghs-export.1') }}</p>
            <ol class="list-decimal ml-6 mb-4">
                <li>{{ $t('ghs-export.2') }}</li>
                <li>{{ $t('ghs-export.3') }}</li>
                <li>{{ $t('ghs-export.4') }}</li>
            </ol>

            <alert v-if="skipped.length" type="warning" class="mb-4">
                {{ $t('ghs-export.skipped') }}: {{ skipped.map(character => $t(character.characterName)).join(', ') }}
            </alert>

            <div class="flex">
                <a id="ghs-download" :href="downloadUrl" download="gloomhaven-storyline-ghs.json" class="mr-2">
                    <button type="button" class="mdc-button mdc-button--raised">
                        <i class="material-icons mdc-button__icon">launch</i>
                        <span class="mdc-button__label">{{ $t('Download') }}</span>
                    </button>
                </a>
                <button id="ghs-copy" type="button" v-clipboard:copy="json" class="mdc-button mdc-button--raised">
                    <i class="material-icons mdc-button__icon">content_copy</i>
                    <span class="mdc-button__label">{{ $t('Copy') }}</span>
                </button>
            </div>
        </template>
    </modal>
</template>

<script>
import tippy from 'tippy.js';
import GhsExport from "../../services/GhsExport";
import SheetRepository from "../../repositories/SheetRepository";
import ScenarioRepository from "../../repositories/ScenarioRepository";

export default {
    inject: ['appData'],
    data() {
        return {
            json: '',
            skipped: [],
            ghsExport: new GhsExport,
            sheetRepository: new SheetRepository,
            scenarioRepository: new ScenarioRepository,
            copyTippy: null,
        }
    },
    computed: {
        downloadUrl() {
            return 'data:application/json;charset=utf-8,' + encodeURIComponent(this.json);
        }
    },
    mounted() {
        this.$bus.$on('open-ghs-export-modal', this.open);
    },
    unmounted() {
        this.$bus.$off('open-ghs-export-modal', this.open);
    },
    methods: {
        async open(scenarioId = null) {
            const sheet = this.sheetRepository.make(this.appData.game);
            const scenario = scenarioId === null ? null : this.scenarioRepository.find(scenarioId);
            const {state, skipped} = this.ghsExport.make(sheet, this.appData.game, scenario);

            this.json = JSON.stringify(state, null, 2);
            this.skipped = skipped;
            this.$refs['modal'].open();

            await this.$nextTick();
            this.addCopyTippy();
        },
        addCopyTippy() {
            if (this.copyTippy) {
                return;
            }

            this.copyTippy = tippy('#ghs-copy', {
                trigger: 'click',
                content: this.$t('Copied'),
                onShown(tippy) {
                    setTimeout(() => {
                        tippy.hide();
                    }, 1500);
                }
            });
        }
    }
}
</script>
