<template>
    <div class="relative">
        <div aria-haspopup="true"
             :aria-expanded="isOpen"
             @click.prevent="isOpen = !isOpen"
        >
            <slot name="trigger"></slot>
        </div>

        <transition name="dropdown">
            <div class="absolute p-2 rounded-lg bg-surface" v-if="isOpen"
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
            align: {default: 'left'}
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
                    }, 100);
                }
            }
        },
        methods: {
            closeIfClickedOutside(event) {
                if (!event.target.closest('.dropdown')) {
                    this.isOpen = false;
                    document.removeEventListener('click', this.closeIfClickedOutside);
                }
            }
        }
    }
</script>
