<template>

</template>

<script>
    import Csrf from "../services/Csrf";
    import UserRepository from "../apiRepositiries/UserRepository";
    import AccessToken from "../services/AccessToken";
    import StoryRepository from "../apiRepositiries/StoryRepository";
    import LoginRepository from "../apiRepositiries/LoginRepository";

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
                    await this.storyRepository.stories();
                    await app.switchCampaign(stories.first().campaignId);

                    this.$router.replace('/story');
                }).catch(e => {
                    this.$router.replace('/story');
                });
            }
        }
    }
</script>
