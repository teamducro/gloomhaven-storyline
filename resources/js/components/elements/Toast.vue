<template>
    <transition name="fade">
        <div v-if="show2" class="fixed right-0 bottom-0 mr-4 mb-4">
            <alert :success="success">
                <slot></slot>
            </alert>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            success: {
                type: Boolean,
                default: true
            },
            autoHide: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                show2: this.show
            }
        },
        mounted() {
            this.letsAutoHide();
        },
        watch: {
            show(show) {
                this.show2 = show;
                this.letsAutoHide();
            }
        },
        methods: {
            letsAutoHide() {
                if (this.show2 && this.autoHide) {
                    setTimeout(() => {
                        this.show2 = false;
                    }, 5000);
                }
            }
        }
    }
</script>
