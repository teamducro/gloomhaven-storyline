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
@reference "../../../sass/tailwind.css";
    .loader {
        &.float {
            @apply absolute;
            right: -40px;
            top: .25rem;
        }

        @apply rounded-full w-6 h-6;
        border: 6px solid transparent;
        border-top-color: var(--color-primary);
        border-bottom-color: var(--color-primary);
        animation: spin-loader 1s ease-in-out infinite;
    }
</style>
