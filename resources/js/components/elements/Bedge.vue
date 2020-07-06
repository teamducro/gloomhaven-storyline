<template>
    <span class="bedge"
          :class="{expired: expired}">
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
        @apply top-0 left-0 font-bold inline-flex items-center px-2 py-.5 rounded-full text-sm font-medium leading-5 bg-green-100 text-green-800;

        &.expired {
            @apply bg-red-100 text-red-800;
        }
    }
</style>
