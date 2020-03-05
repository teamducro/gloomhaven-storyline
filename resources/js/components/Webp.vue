<template>
    <transition name="fade" v-if="animate">
        <img v-show="isLoaded" :src="source" @error="this.error" @load="loaded"/>
    </transition>
    <img v-else :src="source" @error="this.error"/>
</template>

<script>
    export default {
        props: {
            src: {
                type: String,
            },
            animate: {
                type: Boolean,
            }
        },
        data() {
            return {
                source: '',
                isLoaded: false
            }
        },
        mounted() {
            this.source = this.webp();
        },
        watch: {
            src: function (src) {
                this.source = this.webp();
            }
        },
        methods: {
            webp() {
                this.isLoaded = false;
                return this.src.split('.').slice(0, -1) + '.webp';
            },
            error() {
                if (this.source !== this.src) {
                    this.source = this.src;
                }
            },
            loaded() {
                this.isLoaded = true;
            }
        }
    }
</script>
