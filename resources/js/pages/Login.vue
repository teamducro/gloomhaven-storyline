<template>

</template>

<script>
    import UserRepository from "../apiRepositories/UserRepository";
    import AccessToken from "../services/AccessToken";
    import StoryRepository from "../apiRepositories/StoryRepository";
    import AuthRepository from "../apiRepositories/AuthRepository";
    import store from "store/dist/store.modern";

    export default {
        data() {
            return {
                userRepository: new UserRepository,
                accessToken: new AccessToken,
                storyRepository: new StoryRepository,
                storyRepository: new StoryRepository,
                auth: new AuthRepository
            }
        },
        mounted() {
            this.handle();
        },
        methods: {
            handle() {
                this.auth.login().then(async response => {
                    this.accessToken.store(response.data.access_token);
                    await this.userRepository.find();
                    const stories = await this.storyRepository.stories();
                    const story = stories.first();
                    if (story.is_new && stories.count() === 1) {
                        await this.copyLocalToSharedCampaign(story);
                    }
                    await app.switchCampaign(story.campaignId);

                    this.$router.replace('/story');
                }).catch(e => {
                    // throw e;
                    this.$router.replace('/story');
                });
            },
            async copyLocalToSharedCampaign(story) {
                story.data = store.get('local') || {};
                this.storyRepository.storeStory(story);
                this.storyRepository.storeCampaignData(story);
                await this.storyRepository.update(story);
            }
        }
    }
</script>
