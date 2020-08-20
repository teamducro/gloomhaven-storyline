<template>
    <div class="pt-12 pb-4 px-4">
        <div id="info" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 w-full" style="max-width: 560px;">
            <h1 class="mb-4 text-xl">{{ $t('Party sheet') }}</h1>

            <number-field :value="0" :label="$t('Reputation')"></number-field>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    mounted() {
    },
    methods: {}
}
</script>
