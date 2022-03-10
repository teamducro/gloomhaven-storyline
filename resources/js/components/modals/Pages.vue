<template>
    <div>
        <modal ref="modal" :title="title" :full-screen="true">
            <div slot="content" class="w-full h-full outline-none">
                <div id="pages" class="flex flex-col md:flex-row">
                    <webp v-for="page in pages"
                          :src="pageSrc(page)"
                          :key="'page' + page"
                          :alt="'Page #' + pageId(page)"
                          :class="{'md:w-1/2': hasMultiplePages}"/>
                </div>
            </div>
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
            return this.$tc('Page', this.pages.length) + ' #' + this.pages.map(p => this.pageId(p)).join(', ');
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
            const pageWidth = 700;
            if (!this.hasMultiplePages && window.innerWidth > pageWidth) {
                this.zoom.moveTo((window.innerWidth - pageWidth) / 2, 0);
            } else {
                this.zoom.moveTo(0, 0);
            }
        },
        pageId(page) {
            const n = page.lastIndexOf('/');
            return page.substring(n + 1);
        },
        preload() {
            this.pages.forEach((page) => {
                this.preloadImage.handle(this.pageSrc(page));
            })
        }
    }
}
</script>
