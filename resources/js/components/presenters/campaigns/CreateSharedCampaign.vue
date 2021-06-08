<template>
    <button @click="create" type="button" class="mt-6 mdc-button mdc-button--raised">
        {{ $t('Add shared campaign') }}
    </button>
</template>

<script>
import StoryRepository from "../../../apiRepositories/StoryRepository";

export default {
    data() {
        return {
            sending: false,
            success: false,
            storyRepository: new StoryRepository
        }
    },
    mounted() {

    },
    destroyed() {

    },
    methods: {
        create() {
            if (this.sending) {
                return;
            }

            this.sending = true;

            this.storyRepository.create().then(story => {
                this.sending = false;
                this.$bus.$emit('campaign-selected', story.campaignId, true);
            }).catch(e => {
                this.sending = false;
            });
        },
        async selectCampaign(data, isShared = false) {
            const stories = await this.storyRepository.stories(data.access_token);
            if (stories) {
                const story = stories.first();
                this.storyRepository.storeCampaignData(story);
                this.$bus.$emit('campaign-selected', stories.first().campaignId);

                this.success = true;
                setTimeout(() => {
                    this.success = false;
                }, 5000);

                if (isShared) {
                    await this.$router.push('/story');
                } else {
                    this.$scrollTo('#campaigns');
                }
            }
        }
    }
}
</script>
