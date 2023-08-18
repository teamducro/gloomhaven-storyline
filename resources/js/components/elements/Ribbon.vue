<template>
    <div class="ribbon">
        <webp width="40" height="92" :src="game === 'fh' ? '/img/pro-fh.png' : '/img/pro.png'" @loaded="isLoaded = true"/>
        <div v-if="isLoaded" class="text font-title" :class="{'text-fh-dark': game === 'fh'}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        inject: ['appData'],
        data() {
            return {
                isLoaded: false,
                game: null
            }
        },
        mounted() {
            this.render();

            this.$bus.$on('campaigns-changed', this.render);
        },
        destroyed() {
            this.$bus.$off('campaigns-changed', this.render);
        },
        methods: {
            async render() {
                this.game = this.appData.game;
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
            left: .6rem;
        }
    }
</style>
