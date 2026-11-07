<template>
    <div class="pt-12 pb-4 px-2 sm:px-4">
        <games-enabled></games-enabled>
        <transfer></transfer>
        <snapshots></snapshots>

        <div class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
            <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
                <i class="material-icons mr-4" aria-hidden="true">language</i>
                <span>{{ $t('Translations') }}</span>
            </h1>

            <p class="text-base mb-2">{{ $t('Gloomhaven Storyline is available in multiple languages!') }}</p>

            <div class="w-full max-w-sm">
                <language-switch></language-switch>
            </div>

            <p class="text-base mt-2">
                {{ $t('If you like to contribute with translations.') }}
                <email-me class="link">{{ $t('Please send me an e-mail') }}.</email-me>
            </p>
        </div>

        <div class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
            <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
                <i class="material-icons mr-4" aria-hidden="true">text_format</i>
                <span>{{ $t('Font') }}</span>
            </h1>

            <p class="text-base mb-2">{{ $t('Choose which font you would like') }}</p>

            <div class="w-full max-w-sm">
                <font-switch></font-switch>
            </div>
        </div>

        <div v-if="!appData.read_only" id="reset" class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
            <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
                <i class="material-icons mr-4" aria-hidden="true">report_problem</i>
                <span>{{ $t('Danger zone!') }}</span>
            </h1>

            <div class="flex flex-wrap items-start gap-4 mt-4 mb-6">
                <button @click="$bus.$emit('open-reset-modal')" type="button"
                        class="mdc-button mdc-button--raised">
                    <span class="mdc-button__ripple"></span>
                    <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                    <span class="mdc-button__label">{{ $t('Reset campaign') }}</span>
                </button>

                <button v-if="canDelete" @click="confirmDelete" type="button" data-test="delete-campaign"
                        class="mdc-button mdc-button--raised">
                    <span class="mdc-button__ripple"></span>
                    <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                    <span class="mdc-button__label">{{ $t('Delete permanently') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import ApiStoryRepository from "../apiRepositories/StoryRepository";
import Confirm from "../mixins/Confirm";

export default {
    mixins: [Confirm],
    inject: ['appData'],
    data() {
        return {
            apiStoryRepository: new ApiStoryRepository,
        }
    },
    computed: {
        canDelete() {
            return !!app.user?.is_patron && !!this.appData.story && !this.appData.story.is_shared;
        }
    },
    methods: {
        confirmDelete() {
            const story = this.appData.story;
            this.confirm(
                this.$t('Delete permanently'),
                this.$t('delete-campaign-confirm', {name: story.name}),
                () => this.destroy(story),
                this.$t('delete-campaign-note')
            );
        },
        async destroy(story) {
            try {
                await this.apiStoryRepository.destroy(story);
            } catch (e) {
                this.$bus.$emit('toast', this.$t('delete-campaign-failed'), false);
                return;
            }
            this.$bus.$emit('campaign-selected', 'local');
        }
    }
}
</script>
