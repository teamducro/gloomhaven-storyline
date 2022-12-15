<template>
    <div>
        <modal ref="modal" :title="title" :full-screen="true">
            <div slot="content" class="w-full h-full overflow-y-scroll outline-none">
                <div id="pages" class="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <webp v-for="page in pages"
                          :src="pageSrc(page)"
                          :key="'page' + page"
                          :alt="'Page #' + pageId(page)"
                          class="w-full"/>
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
