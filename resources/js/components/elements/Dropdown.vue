<template>
    <div class="relative inline-block">
        <div class="trigger"
             aria-haspopup="true"
             :aria-expanded="isOpen"
             @click.prevent="open"
        >
            <slot name="trigger"></slot>
        </div>

        <transition name="dropdown">
            <div class="dropdown absolute z-10 p-2 rounded-lg bg-surface" v-if="isOpen"
                 :class="align === 'left' ? 'left-0' : 'right-0'"
                 :style="width"
            >
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    inject: ['appData'],
    props: {
        width: {
            default: () => {
                return {width: 'auto'}
            }
        },
        align: {default: 'left'},
        shouldToggle: {default: true},
        autoDisable: {default: false},
    },
    data() {
        return {
            isOpen: false
        }
    },
    computed: {
        isDisabled() {
            return this.autoDisable && this.appData.read_only;
        }
    },
    watch: {
        isOpen(isOpen) {
            if (isOpen) {
                this.$emit('open');
                setTimeout(() => {
                    document.addEventListener('click', this.closeIfClickedOutside);
                    this.$emit('opened');
                }, 100);
            } else {
                this.$emit('close');
                document.removeEventListener('click', this.closeIfClickedOutside);
                this.$emit('closed');
            }
        }
    },
    methods: {
        closeIfClickedOutside(event) {
            if (!event.target.closest('.dropdown')) {
                if (this.shouldToggle || (!this.shouldToggle && !event.target.closest('.trigger'))) {
                    this.close();
                }
            }
        },
        open() {
            if (this.isDisabled) {
                return;
            }

            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
        },
        toggle() {
            this.isOpen = !this.isOpen;
        }
    }
}
</script>
