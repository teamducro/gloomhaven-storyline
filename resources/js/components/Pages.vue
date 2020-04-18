<template>
    <div>
        <modal ref="modal" :title="title" :full-screen="true">
            <template v-slot:content>
                <div class="w-full h-full outline-none">
                    <div id="pages" class="flex flex-col md:flex-row">
                        <webp :src="firstSrc"
                              :alt="'Page #' + firstPage"
                              :class="{'md:w-1/2': hasMultiplePages}"/>
                        <webp v-if="hasMultiplePages"
                              :src="secondSrc"
                              :alt="'Page #' + secondPage"
                              class="md:w-1/2"/>
                    </div>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
    import panzoom from "panzoom"
    import PreloadImage from "../services/PreloadImage";

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
            firstPage() {
                return _.first(this.pages);
            },
            secondPage() {
                return _.last(this.pages);
            },
            firstSrc() {
                return this.pageSrc(this.firstPage);
            },
            secondSrc() {
                return this.pageSrc(this.secondPage);
            },
            hasMultiplePages() {
                return this.pages.length > 1;
            },
            title() {
                let title = 'Page #' + this.firstPage;

                if (this.hasMultiplePages) {
                    title + ' / ' + this.secondPage;
                }

                return title;
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
            }
        }
    }
</script>
