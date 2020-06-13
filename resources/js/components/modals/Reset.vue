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
    import Reset from "../../services/Reset";

    export default {
        data() {
            return {
                reset: new Reset
            }
        },
        mounted() {
            this.$bus.$on('open-reset-modal', this.open);
        },
        methods: {
            open() {
                this.$refs['modal'].open();
            },
            reset() {
                this.reset.reset();
                app.fetchScenarios();
                app.fetchAchievements();
            }
        }
    }
</script>
