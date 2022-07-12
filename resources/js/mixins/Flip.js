import {Flip} from "gsap/Flip.js";

const md5 = require('js-md5');

export default {
    data: function () {
        return {
            animationStack: {}
        }
    },
    methods: {
        async animate(selector, closure) {
            // Record an animation using the selector as the key.
            this.startAnimation(selector);

            // Get the starting state of the elements.
            const state = Flip.getState(selector);

            // Apply the changes on the animating elements.
            closure();

            // Wait till the changes are applied.
            await this.$nextTick();

            return new Promise((resolve, reject) => {
                // Animate from starting state to the end.
                Flip.from(state, {
                    duration: 1,
                    ease: "power1.inOut",
                    absolute: true,
                    simple: true,
                    onComplete: () => {
                        // Only call completion when all animations with this selector are finished.
                        if (this.endAnimation(selector) === 0) {
                            resolve();
                        }
                    }
                });
            });
        },
        startAnimation(selector) {
            this.animationStack[md5(selector)] = (this.animationStack[md5(selector)] ?? 0) + 1
        },
        endAnimation(selector) {
            return --this.animationStack[md5(selector)];
        }
    }
}
