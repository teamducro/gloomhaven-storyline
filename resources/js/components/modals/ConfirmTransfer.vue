<template>
    <modal ref="modal" :title="$t('Transfer')">
        <template v-slot:content>
            <p>Are you sure you want to transfer all campaign data from {{ fromName }} to {{ toName }}?</p>
        </template>
        <template v-slot:buttons>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                <span class="mdc-button__label">{{ $t('Cancel') }}</span>
            </button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                    @click="transfer">
                <span class="mdc-button__label text-red-700">{{ $t('Transfer') }}</span>
            </button>
        </template>
    </modal>
</template>

<script>
import Transferor from "../../services/Transferor";
import StoryRepository from "../../repositories/StoryRepository";

export default {
    data() {
        return {
            story: null,
            fromName: null,
            toName: null,
            storyRepository: new StoryRepository,
            transferService: new Transferor,
        }
    },
    mounted() {
        this.$bus.$on('open-transfer-modal', this.open);
    },
    methods: {
        open(value) {
            this.fromName = app.campaignId === 'local'
                ? this.$t('local')
                : this.storyRepository.current().name;
            this.story = null;

            if (value === 'local') {
                this.toName = this.$t('local');
            } else {
                this.story = this.storyRepository.find(value)
                this.toName = this.story.name;
            }

            this.$refs['modal'].open();
        },
        async transfer() {
            await this.transferService.transfer(this.story);

            this.$bus.$emit('load-campaign-data');
        }
    }
}
</script>
