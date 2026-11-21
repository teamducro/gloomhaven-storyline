<template>
    <component v-if="component" v-bind:is="component"></component>
</template>
<script>
import {shallowReactive} from "vue";

// Storylines stay eager: Story.vue zooms the svg right after it renders. The rest (~2.5 MB, mostly character icons) loads on first use.
const svgs = shallowReactive(import.meta.glob('../../../svg/storylines/*.svg', {query: '?raw', import: 'default', eager: true}));
const lazySvgs = import.meta.glob(['../../../svg/**/*.svg', '!../../../svg/storylines/*.svg'], {query: '?raw', import: 'default'});

export default {
    props: {
        src: String,
        classes: [Array, String],
        width: Number,
        height: Number,
        id: String,
    },

    watch: {
        path: {
            immediate: true,
            async handler(path) {
                if (!(path in svgs) && lazySvgs[path]) {
                    svgs[path] = await lazySvgs[path]();
                }
            }
        }
    },

    computed: {
        path() {
            return '../../../svg/' + (this.src.endsWith('.svg') ? this.src : this.src + '.svg');
        },
        // Separate from component: classes is often an inline array, a new one each parent render, but the markup stays equal.
        markup() {
            if (!svgs[this.path]) {
                return null;
            }

            return new Svg(svgs[this.path])
                .classes(this.classes)
                .width(this.width)
                .height(this.height)
                .id(this.id)
                .toString();
        },
        // A new component object per render made Vue remount the whole svg on every parent update.
        component() {
            return this.markup && {template: this.markup};
        },
    }
};

class Svg {
    constructor(raw) {
        let div = document.createElement('div');
        div.innerHTML = raw;

        let fragment = document.createDocumentFragment();
        fragment.appendChild(div);

        this.svg = fragment.querySelector('svg');
        this.container = div;
    }

    classes(classes) {
        if (classes) {
            if (Array.isArray(classes)) {
                classes.forEach((c) => {
                    this.svg.classList.add(c);
                });
            } else {
                this.svg.classList.add(classes);
            }
        }

        return this;
    }

    width(width) {
        if (width) {
            this.svg.setAttribute('width', width);
        }

        return this;
    }

    height(height) {
        if (height) {
            this.svg.setAttribute('height', height);
        }

        return this;
    }

    id(id) {
        if (id) {
            this.svg.setAttribute('id', id);
        }

        return this;
    }

    toString() {
        this.stripScriptsAndStyles();
        return this.container.outerHTML;
    }

    stripScriptsAndStyles() {
        ['defs', 'script', 'style'].forEach((tag) => {
            Array.from(this.svg.getElementsByTagName(tag))
                .forEach((el) => this.svg.removeChild(el));
        })
    }
}
</script>
