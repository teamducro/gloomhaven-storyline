<template>
    <div v-if="decoded" class="pt-12 pb-4 px-2 sm:px-4">
        <div class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl" data-test="shared-confirm">
            <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
                <i class="material-icons mr-4" aria-hidden="true">restore</i>
                {{ $t('local-backup.replace-title') }}
            </h1>
            <p class="text-base">{{ $t('local-backup.confirm') }}</p>
            <div class="flex flex-wrap justify-end gap-4 mt-6">
                <button @click="redirect" type="button" class="mdc-button" data-test="shared-cancel">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label">{{ $t('Cancel') }}</span>
                </button>
                <button @click="importCampaign" type="button" class="mdc-button mdc-button--raised"
                        data-test="shared-replace">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label">{{ $t('local-backup.replace') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import ShareState from "../services/ShareState";
import GameData from "../services/GameData";

export default {
    inject: ['appData'],
    data() {
        return {
            shareState: new ShareState,
            gameData: new GameData,
            decoded: null,
        }
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        path() {
            return this.$route.params.path || 'story';
        },
    },
    mounted() {
        this.handle();
    },
    methods: {
        async handle() {
            const decoded = this.shareState.decodeLink(this.$route.params.version, this.id, this.$route.params.storage);
            if (!decoded) {
                this.$bus.$emit('toast', 'This shared link is incompatible with this version of the Gloomhaven Storyline Tracker. Please request a new link from the <a href="/tracker/#/campaigns" class="underline">campaigns page</a>.', false);
                await this.redirect();
                return;
            }

            this.decoded = decoded;
            if (!this.shareState.hasProgress(this.id)) {
                await this.importCampaign();
            }
        },
        async importCampaign() {
            this.shareState.importLink(this.id, this.decoded);
            this.$bus.$emit('campaign-selected', this.id);
            this.$bus.$emit('toast', 'Imported campaign progress successful.');

            const game = this.$route.params.game || this.appData.mainGame;
            if (this.gameData.validate(game)) {
                this.$bus.$emit('game-selected', game);
            }

            await this.redirect();
        },
        async redirect() {
            await this.$nextTick();
            this.$router.replace('/' + this.path);
        }
    }
}
</script>
