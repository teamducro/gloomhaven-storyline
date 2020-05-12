<template>
    <transition name="fade" v-if="animate">
        <img v-show="isLoaded" :src="source"
             :class="imageClasses"
             :width="width"
             @error=" this.error" @load="loaded"/>
    </transition>
    <img v-else :src="source"
         :class="imageClasses"
         :width="width"
         @error="this.error" @load="loaded"/>
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
                type: Boolean,
                default: false
            },
            cover: {
                type: Boolean,
                default: false
            },
            retina: {
                type: Boolean,
                default: false
            },
            force: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                source: '',
                width: '',
                isLoaded: false,
                preloadImage: new PreloadImage()
            }
        },
        computed: {
            imageClasses() {
                let classes = [];
                if (this.cover) {
                    classes = _.merge(classes, ['object-cover', 'max-w-none', 'w-full', 'h-full']);
                }
                return classes;
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
                this.source = app.webpSupported === false || !this.force
                    ? src
                    : this.webp(src);

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
            loaded(e) {
                if (this.retina) {
                    this.width = e.target.naturalWidth / 2;
                }
                this.isLoaded = true;
                this.$emit('loaded');
            }
        }
    }
</script>
