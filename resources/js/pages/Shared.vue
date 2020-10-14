<template></template>

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
            const version = this.$route.params.version;
            const id = this.$route.params.id;
            const compressed = this.$route.params.storage;

            if (this.shareState.loadNewLink(version, id, compressed)) {
                this.$bus.$emit('campaign-selected', id);
            } else {
                alert('This shared link is incompatible with this version of the Gloomhaven Storyline Tracker. Please use the most recent version and/or ask for a new link.')
            }

            await this.$nextTick();
            this.$router.replace('/story');
        }
    }
}
</script>
