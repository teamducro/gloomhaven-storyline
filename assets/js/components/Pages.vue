<template>
    <div>
        <modal ref="modal" :title="'Page #' + currentPage">
            <template v-slot:content>
                <img :src="currentSrc" :alt="'Page #' + currentPage"/>
            </template>
            <template v-if="hasMultiplePages" v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" @click="prev">
                    <span class="mdc-button__label"><i class="material-icons">navigate_before</i></span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" @click="next">
                    <span class="mdc-button__label"><i class="material-icons">navigate_next</i></span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
    export default {
        props: ['pages'],
        data() {
            return {
                current: 0
            }
        },
        computed: {
            currentPage() {
                return this.pages[this.current];
            },
            currentSrc() {
                return 'scenarios/' + this.currentPage + '.jpg';
            },
            hasMultiplePages() {
                return this.pages.length > 1
            }
        },
        methods: {
            open() {
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
