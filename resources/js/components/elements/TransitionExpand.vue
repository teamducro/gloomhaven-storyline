<script>
export default {
    name: 'TransitionExpand',
    functional: true,
    render(createElement, context) {
        const emit = function (event, context, element) {
            const e = context.listeners[event];
            if (e) {
                e(element);
            }
        };

        const data = {
            props: {
                name: 'expand',
            },
            on: {
                afterEnter(element) {
                    emit('after-enter', context, element);
                    element.style.height = 'auto';
                },
                enter(element) {
                    emit('enter', context, element);
                    element.style.visibility = 'hidden';
                    element.style.position = 'absolute';
                    element.style.height = '0';

                    setTimeout(() => {
                        element.style.height = 'auto';
                        const {width} = getComputedStyle(element);
                        element.style.width = width;
                        const {height} = getComputedStyle(element);
                        element.style.width = null;
                        element.style.position = null;
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
                    emit('leave', context, element);
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
        return createElement('transition', data, context.children);
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
