<template>
    <component v-bind:is="component"></component>
</template>
<script>
export default {
    props: {
        src: String,
        classes: [Array, String],
        width: Number,
        height: Number,
        id: String,
    },

    computed: {
        // Separate from component: classes is often an inline array, a new one each parent render, but the markup stays equal.
        markup() {
            return new Svg(this.src)
                .classes(this.classes)
                .width(this.width)
                .height(this.height)
                .id(this.id)
                .toString();
        },
        // A new component object per render made Vue remount the whole svg on every parent update.
        component() {
            return {template: this.markup};
        },
    }
};

const svgs = import.meta.glob('../../../svg/**/*.svg', {query: '?raw', import: 'default', eager: true});

class Svg {
    constructor(src) {
        let div = document.createElement('div');
        if (!src.endsWith('.svg')) {
            src += '.svg';
        }
        div.innerHTML = svgs['../../../svg/' + src];

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
