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
                 :style="{ width }"
            >
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        width: {default: 'auto'},
        align: {default: 'left'},
        shouldToggle: {default: true},
    },
    data() {
        return {
            isOpen: false
        }
    },
    watch: {
        isOpen(isOpen) {
            if (isOpen) {
                setTimeout(() => {
                    document.addEventListener('click', this.closeIfClickedOutside);
                    this.$emit('opened');
                }, 100);
            } else {
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
