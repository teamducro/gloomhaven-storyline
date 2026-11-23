<template>
    <div v-if="campaignId === 'local'" id="local-backup"
         class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
        <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
            <i class="material-icons mr-4" aria-hidden="true">cloud_off</i>
            {{ $t('local-backup.title') }}
        </h1>

        <p class="text-base">{{ $t('local-backup.text') }}</p>

        <h2 class="text-xl mt-6">{{ $t('local-backup.backup') }}</h2>
        <p class="text-base mt-2">{{ $t('local-backup.backup-text') }}</p>
        <div class="flex items-center mt-2">
            <input class="flex-1 min-w-0 p-2 rounded bg-black2-25 truncate" type="text" readonly
                   data-test="backup-link" :value="link" @focus="$event.target.select()">
            <button v-clipboard:copy="link" @click="copied" type="button"
                    class="mdc-button mdc-button--raised ml-3" data-test="copy-backup">
                <span class="mdc-button__ripple"></span>
                <i class="material-icons mdc-button__icon" aria-hidden="true">content_copy</i>
                <span class="mdc-button__label">{{ $t('local-backup.copy') }}</span>
            </button>
        </div>

        <h2 class="text-xl mt-6">{{ $t('local-backup.restore') }}</h2>
        <p class="text-base mt-2">{{ $t('local-backup.restore-text') }}</p>
        <form @submit.prevent="restore" class="flex items-center mt-2 mb-2">
            <input class="flex-1 min-w-0 p-2 rounded bg-black2-25" type="text" v-model="restoreLink"
                   data-test="restore-link" :placeholder="$t('local-backup.paste')">
            <button type="submit" class="mdc-button mdc-button--raised ml-3" data-test="restore-backup">
                <span class="mdc-button__ripple"></span>
                <i class="material-icons mdc-button__icon" aria-hidden="true">restore</i>
                <span class="mdc-button__label">{{ $t('local-backup.restore') }}</span>
            </button>
        </form>
    </div>
</template>

<script>
import ShareState from "../../../services/ShareState";

export default {
    inject: ['appData'],
    data() {
        return {
            campaignId: null,
            link: '',
            restoreLink: '',
            shareState: new ShareState,
        }
    },
    mounted() {
        this.$listen('campaigns-changed', this.refresh);
        this.refresh();
    },
    methods: {
        refresh() {
            this.campaignId = app.campaignId;
            this.link = this.campaignId === 'local'
                ? this.shareState.link('local', 'story', this.appData.game)
                : '';
        },
        copied() {
            this.$bus.$emit('toast', this.$t('Copied'));
        },
        restore() {
            const path = this.shareState.sharedPath(this.restoreLink);
            if (!path) {
                this.$bus.$emit('toast', this.$t('local-backup.invalid'), false);
                return;
            }

            // Shared.vue asks before it replaces a campaign with progress
            this.$router.push(path);
        },
    }
}
</script>
