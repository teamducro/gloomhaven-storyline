<template>
    <modal ref="modal" :title="$t('Remove')">
        <template v-slot:content>
            <p>{{ $t('reset.text') }}</p>
            <p v-if="loggedIn && current">
                All data will be lost for all users that do have access to: "{{ current.name }}".
            </p>
        </template>
        <template v-slot:buttons>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                <span class="mdc-button__label">{{ $t('Cancel') }}</span>
            </button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                    @click="reset">
                <span class="mdc-button__label text-red-700">{{ $t('Clear all') }}</span>
            </button>
        </template>
    </modal>
</template>

<script>
    import Reseter from "../../services/Reseter";
    import Helpers from "../../services/Helpers";
    import StoryRepository from "../../repositories/StoryRepository";

    export default {
        data() {
            return {
                resetService: new Reseter,
                loggedIn: Helpers.loggedIn(),
                storyRepository: new StoryRepository,
                current: null,
            }
        },
        mounted() {
            this.$bus.$on('open-reset-modal', this.open);
        },
        methods: {
            open() {
                this.current = this.storyRepository.current();
                this.$refs['modal'].open();
            },
            reset() {
                const campaignId = this.current ? this.current.campaignId : 'local';
                this.resetService.reset(campaignId);
            }
        }
    }
</script>
