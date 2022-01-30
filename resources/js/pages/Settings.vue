<template>
    <div class="pt-12 pb-4 px-4">
        <transfer></transfer>
        <snapshots></snapshots>

        <div id="reset" class="bg-black2-25 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
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
