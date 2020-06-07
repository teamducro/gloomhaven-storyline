<template>

</template>

<script>
    import Csrf from "../services/Csrf";
    import UserRepository from "../repositories/UserRepository";

    export default {
        data() {
            return {
                userRepository: new UserRepository
            }
        },
        mounted() {
            this.login();
        },
        methods: {
            login() {
                (new Csrf).init().then(() => {
                    const url = location.hash.substr(1);
                    axios.get(url).then(async response => {
                        const user = await this.userRepository.find(response.data.access_token);
                        this.userRepository.storeAccessToken(response.data.access_token, user.id);

                        // fetch stories
                        // select story

                        this.$router.replace('/story');
                    }).catch(e => {
                        this.$router.replace('/story');
                    });
                });
            }
        }
    }
</script>
