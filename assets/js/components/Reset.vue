<template>
    <modal ref="modal" title="Remove">
        <template v-slot:content>
            <p>Are you sure you want to remove scenario data?</p>
        </template>
        <template v-slot:buttons>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                <span class="mdc-button__label">Cancel</span>
            </button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                    @click="reset">
                <span class="mdc-button__label">Clear all</span>
            </button>
        </template>
    </modal>
</template>

<script>
    export default {
        data() {
            return {}
        },
        mounted() {
            this.$bus.$on('open-reset-modal', () => {
                this.open();
            });
        },
        methods: {
            open() {
                this.$refs['modal'].open();
            },
            reset() {
                localStorage.clear();
                app.fetchScenarios();
            }
        }
    }
</script>
