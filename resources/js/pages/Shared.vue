<template>

</template>

<script>
import ShareState from "../services/ShareState";

export default {
    data() {
        return {
            shareState: new ShareState
        }
    },
    mounted() {
        this.handle();
    },
    methods: {
        async handle() {
            const compressed = this.$route.params.storage;
            this.shareState.loadNewLink(compressed);
            this.$bus.$emit('campaign-selected', app.campaignId);

            await this.$nextTick();
            this.$router.replace('/story');
        }
    }
}
</script>
