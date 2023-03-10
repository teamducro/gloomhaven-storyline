<template>
    <span class="bedge font-default"
          :class="{expired: expired}"
          @click="(e) => $emit('click', e)">
        <slot></slot>
    </span>
</template>

<script>
export default {
    props: {
        expired: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped lang="scss">
.bedge {
    @apply top-0 left-0 inline-flex relative items-center px-2 py-.5 text-sm font-medium leading-5 bg-green-100 text-green-800;

    &.expired {
        @apply bg-red-100 text-red-800;
    }

    &.white {
        @apply bg-gray-50 text-gray-800;
    }

    &.small {
        @apply font-sans text-xxs leading-3;
    }

    &:not([class*='rounded']) {
        @apply rounded-full;
    }
}
</style>
