<template>
    <div class="pt-12 pb-4 px-2 sm:px-4">
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

        <div id="reset" class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
            <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
                <i class="material-icons mr-4" aria-hidden="true">report_problem</i>
                <span>{{ $t('Danger zone!') }}</span>
            </h1>

            <button @click="$bus.$emit('open-reset-modal')" type="button"
                    class="mt-4 mb-6 mdc-button mdc-button--raised">
                <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                <span class="mdc-button__label">{{ $t('Reset campaign') }}</span>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {}
}
</script>
