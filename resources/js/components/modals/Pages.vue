<template>
    <div>
        <modal ref="modal" :title="title" :full-screen="true">
            <template v-slot:content>
                <div class="w-full h-full outline-none">
                    <div id="pages" class="flex flex-col md:flex-row">
                        <webp v-for="page in pages"
                              :src="pageSrc(page)"
                              :key="'page' + page"
                              :alt="'Page #' + page"
                              :class="{'md:w-1/2': hasMultiplePages}"/>
                    </div>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
    import panzoom from "panzoom"
    import PreloadImage from "../../services/PreloadImage";

    export default {
        props: {
            pages: {
                type: Array,
                default: []
            },
        },
        data() {
            return {
                zoom: null,
                preloadImage: new PreloadImage()
            }
        },
        mounted() {
            this.zoom = panzoom(document.querySelector('#pages'), {
                minZoom: 1,
                maxZoom: 4,
                bounds: true
            });
        },
        computed: {
            hasMultiplePages() {
                return this.pages.length > 1;
            },
            title() {
                return 'Page #' + this.pages.join(', ');
            }
        },
        methods: {
            pageSrc(page) {
                return '/img/pages/' + page + '.jpg';
            },
            open() {
                this.$refs['modal'].open();
                this.centerPage();
            },
            centerPage() {
                const pageWidth = $('#pages img').first().width();
                if (!this.hasMultiplePages && window.innerWidth > pageWidth) {
                    this.zoom.moveTo((window.innerWidth - pageWidth) / 2, 0);
                } else {
                    this.zoom.moveTo(0, 0);
                }
            },
            preload() {
                this.pages.forEach((page) => {
                    this.preloadImage.handle(this.pageSrc(page));
                })
            }
        }
    }
</script>
