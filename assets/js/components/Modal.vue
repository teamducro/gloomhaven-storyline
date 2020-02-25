<template>
    <div class="mdc-dialog" ref="modal" aria-modal="true">
        <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface relative">
                <slot name="body">
                    <h2 class="mdc-dialog__title" :class="{'pr-16': closeButton}">{{ title }}
                        <button v-if="closeButton" type="button" data-mdc-dialog-action="close"
                                class="mdc-button absolute right-0 top-0 mt-4">
                            <i class="material-icons">close</i>
                        </button>
                    </h2>
                    <div class="mdc-dialog__content">
                        <slot name="content">{{ content }}</slot>
                    </div>
                    <footer v-if="$slots.buttons" class="mdc-dialog__actions">
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
        props: {
            title: {
                type: String
            },
            content: {
                type: String
            },
            closeButton: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                modal: null
            }
        },
        mounted() {
            this.modal = new MDCDialog(this.$refs['modal']);
            this.modal.listen('MDCDialog:opening', () => {
                this.$emit('opening');
            });
            this.modal.listen('MDCDialog:opened', () => {
                this.$emit('opened');
            });
            this.modal.listen('MDCDialog:closing', (action) => {
                this.$emit('closing', action);
            });
            this.modal.listen('MDCDialog:closed', (action) => {
                this.$emit('closed', action);
            });
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
    .mdc-dialog .mdc-dialog__surface {
        width: calc(100vw - 32px);
    }

    @media (min-width: 592px) {
        .mdc-dialog .mdc-dialog__surface {
            width: 560px;
        }
    }
</style>
