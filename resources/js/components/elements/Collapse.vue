<template>
    <div class="relative">
        <div aria-haspopup="true"
             :aria-expanded="isOpen"
             @click.prevent="isOpen = !isOpen"
             class="cursor-pointer"
             :class="showIcon ? 'flex items-center' : ''"
        >
            <slot name="trigger"></slot>
            <i v-if="showIcon"
               class="material-icons mdc-button__icon transform transition-transform duration-500 text-white"
               :class="{'rotate-0': isOpen, 'rotate-180': !isOpen}">
                keyboard_arrow_up
            </i>
        </div>

        <transition-expand>
            <div v-if="isOpen">
                <slot></slot>
            </div>
        </transition-expand>
    </div>
</template>

<script>
    export default {
        props: {
            initialOpen: {
                type: Boolean,
                default: false
            },
            showIcon: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                isOpen: this.initialOpen
            }
        },
        watch: {},
        methods: {}
    }
</script>
