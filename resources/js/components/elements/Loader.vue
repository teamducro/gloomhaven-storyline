<template>
    <div class="loader" :class="{float: float}"></div>
</template>

<script>
    export default {
        props: {
            float: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped lang="scss">
    .loader {
        &.float {
            @apply absolute;
            right: -40px;
            top: .25rem;
        }

        @apply rounded-full w-6 h-6;
        border: 6px solid transparent;
        border-top-color: theme('colors.primary');
        border-bottom-color: theme('colors.primary');
        animation: spin 1s ease-in-out infinite;
    }
</style>
