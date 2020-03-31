<template>
    <div>
        <modal ref="modal" :title="'Page #' + currentPage">
            <template v-slot:content>
                <div class="overflow-hidden outline-none">
                    <webp id="page" :src="currentSrc"
                          :alt="'Page #' + currentPage"></webp>
                </div>
            </template>
            <template v-if="hasMultiplePages" v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" @click="prev" :disabled="hasPrev">
                    <i class="material-icons">navigate_before</i>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" @click="next" :disabled="hasNext">
                    <i class="material-icons">navigate_next</i>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
    import panzoom from "panzoom"

    export default {
        props: ['pages'],
        data() {
            return {
                current: 0,
                zoom: null
            }
        },
        mounted() {
            this.zoom = panzoom(document.querySelector('#page'), {
                minZoom: 1,
                maxZoom: 3,
                bounds: true
            });
        },
        computed: {
            currentPage() {
                return this.pages[this.current];
            },
            currentSrc() {
                return '/img/pages/' + this.currentPage + '.jpg';
            },
            hasMultiplePages() {
                return this.pages.length > 1;
            },
            hasPrev() {
                return this.current <= 0;
            },
            hasNext() {
                return this.current >= this.pages.length - 1;
            }
        },
        methods: {
            open() {
                this.current = 0;
                this.$refs['modal'].open();
            },
            prev() {
                this.current--;
                if (this.current < 0) {
                    this.current = this.pages.length - 1;
                }
            },
            next() {
                this.current++;
                if (this.current > this.pages.length - 1) {
                    this.current = 0;
                }
            }
        }
    }
</script>
