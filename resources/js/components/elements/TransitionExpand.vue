<template>
    <transition name="expand" @after-enter="afterEnter" @enter="enter" @leave="leave">
        <slot></slot>
    </transition>
</template>

<script>
export default {
    name: 'TransitionExpand',
    emits: ['after-enter', 'enter', 'leave'],
    methods: {
        afterEnter(element) {
            this.$emit('after-enter', element);
            element.style.height = 'auto';
        },
        enter(element) {
            this.$emit('enter', element);
            element.style.visibility = 'hidden';
            element.style.position = 'absolute';
            element.style.height = '0';

            setTimeout(() => {
                // Measure in the normal flow: absolutely positioned, wrapping content gets a different width and height
                element.style.position = null;
                element.style.height = 'auto';
                const {height} = getComputedStyle(element);
                element.style.visibility = null;
                element.style.height = '0';
                // Force repaint to make sure the animation is triggered correctly.
                getComputedStyle(element).height;
                setTimeout(() => {
                    element.style.height = height;
                });
            }, 50);
        },
        leave(element) {
            this.$emit('leave', element);
            const {height} = getComputedStyle(element);
            element.style.height = height;
            // Force repaint to make sure the animation is triggered correctly.
            getComputedStyle(element).height;
            setTimeout(() => {
                element.style.height = '0';
            });
        },
    },
};
</script>

<style scoped>
* {
    will-change: height;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}
</style>
