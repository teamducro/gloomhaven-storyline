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
            const path = this.$route.params.path || 'story';

            if (this.shareState.loadNewLink(version, id, compressed)) {
                this.$bus.$emit('campaign-selected', id);
                this.$bus.$emit('toast', 'Imported campaign progress successful.');
            } else {
                this.$bus.$emit('toast', 'This shared link is incompatible with this version of the Gloomhaven Storyline Tracker. Please request a new link from the <a href="/tracker/#/campaigns" class="underline">campaigns page</a>.', false);
            }

            await this.$nextTick();

            this.$router.replace('/' + path);
        }
    }
}
</script>
