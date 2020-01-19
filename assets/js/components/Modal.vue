<template>
    <div class="mdc-dialog" ref="modal" aria-modal="true">
        <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface relative">
                <slot name="body">
                    <h2 class="mdc-dialog__title">{{ title }}</h2>
                    <div class="mdc-dialog__content">
                        <slot name="content">{{ content }}</slot>
                    </div>
                    <footer class="mdc-dialog__actions">
                        <slot name="buttons"></slot>
                    </footer>
                </slot>
            </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
    </div>
</template>

<script>
    import {MDCDialog} from '@material/dialog';

    export default {
        props: ['title', 'content'],
        data() {
            return {
                modal: null
            }
        },
        mounted() {
            this.modal = new MDCDialog(this.$refs['modal']);
        },
        methods: {
            open() {
                this.modal.open();
            },
            close() {
                this.modal.close();
            }
        }
    }
</script>

<style lang="scss">

</style>
