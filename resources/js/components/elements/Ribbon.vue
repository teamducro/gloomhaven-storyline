<template>
    <div class="ribbon">
        <webp width="40" height="92" src="img/pro.png" @loaded="isLoaded = true"/>
        <div v-if="isLoaded" class="text">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isLoaded: false
            }
        }
    }
</script>

<style scoped lang="scss">
    .ribbon {
        @apply absolute top-0 -mt-10;
        right: -2.5rem;

        .text {
            font-size: .9rem;
            @apply absolute transform -rotate-90;
            top: 2.2rem;
            left: .45rem;
        }
    }
</style>
