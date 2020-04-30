<template>
    <transition name="fade" v-if="animate">
        <img v-show="isLoaded" :src="source" @error="this.error" @load="loaded"/>
    </transition>
    <img v-else :src="source" @error="this.error"/>
</template>

<script>
    import PreloadImage from "../../services/PreloadImage";

    export default {
        props: {
            src: {
                type: String
            },
            highres: {
                type: String
            },
            animate: {
                type: Boolean
            }
        },
        data() {
            return {
                source: '',
                isLoaded: false,
                preloadImage: new PreloadImage()
            }
        },
        mounted() {
            this.render(this.src);
        },
        watch: {
            src: function (src) {
                this.render(src);
            }
        },
        methods: {
            async render(src) {
                this.isLoaded = false;
                this.source = app.webpSupported
                    ? this.webp(src)
                    : src;

                if (this.highres) {
                    await this.$nextTick();
                    this.source = await this.preloadImage.handle(this.highres);
                }
            },
            webp(url) {
                return url.split('.').slice(0, -1) + '.webp';
            },
            error() {
                if (this.source !== this.src) {
                    this.source = this.src;
                }
            },
            loaded() {
                this.isLoaded = true;
                this.$emit('loaded');
            }
        }
    }
</script>
