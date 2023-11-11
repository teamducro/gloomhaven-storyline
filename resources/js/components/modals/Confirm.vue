<template>
    <modal ref="modal" :title="title || $t('Confirm')">
        <template v-slot:content>
            <p v-if="message">{{ message }}</p>
            <p v-if="note">{{ note }}</p>
        </template>
        <template v-slot:buttons>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                <span class="mdc-button__label">{{ $t('Cancel') }}</span>
            </button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                    @click="confirm">
                <span class="mdc-button__label">{{ $t('Confirm') }}</span>
            </button>
        </template>
    </modal>
</template>

<script>
export default {
    data() {
        return {
            title: null,
            message: null,
            callback: null,
            note: null
        }
    },
    mounted() {
        this.$bus.$on('open-confirm', this.open);
    },
    methods: {
        open(data) {
            this.title = data.title || null;
            this.message = data.message || null;
            this.note = data.note || null;
            this.callback = data.callback;

            this.$refs['modal'].open();
        },

        confirm() {
            this.$refs['modal'].close();
            this.callback();
        }
    }
}
</script>
