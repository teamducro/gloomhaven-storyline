<template>
    <modal ref="modal" :title="$t('Remove')">
        <template v-slot:content>
            <p>{{ $t('reset.text') }}</p>
        </template>
        <template v-slot:buttons>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                <span class="mdc-button__label">{{ $t('Cancel') }}</span>
            </button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                    @click="reset">
                <span class="mdc-button__label">{{ $t('Clear all') }}</span>
            </button>
        </template>
    </modal>
</template>

<script>
    import store from "store/dist/store.modern";

    export default {
        data() {
            return {}
        },
        mounted() {
            this.$bus.$on('open-reset-modal', this.open);
        },
        methods: {
            open() {
                this.$refs['modal'].open();
            },
            reset() {
                store.clearAll();
                app.fetchScenarios();
                app.fetchAchievements();
            }
        }
    }
</script>
