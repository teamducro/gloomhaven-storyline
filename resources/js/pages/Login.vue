<template>

</template>

<script>
    import Csrf from "../services/Csrf";
    import UserRepository from "../apiRepositories/UserRepository";
    import AccessToken from "../services/AccessToken";
    import StoryRepository from "../apiRepositories/StoryRepository";
    import LoginRepository from "../apiRepositories/LoginRepository";

    export default {
        data() {
            return {
                userRepository: new UserRepository,
                accessToken: new AccessToken,
                storyRepository: new StoryRepository,
                login: new LoginRepository
            }
        },
        mounted() {
            this.handle();
        },
        methods: {
            handle() {
                this.login.login().then(async response => {
                    this.accessToken.store(response.data.access_token);
                    await this.userRepository.find();
                    const stories = await this.storyRepository.stories();
                    await app.switchCampaign(stories.first().campaignId);

                    this.$router.replace('/story');
                }).catch(e => {
                    // throw e;
                    this.$router.replace('/story');
                });
            }
        }
    }
</script>
