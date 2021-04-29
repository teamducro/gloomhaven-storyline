<template>
    <component v-bind:is="render()"></component>
</template>
<script>
    export default {
        props: {
            src: String,
            classes: Array,
            width: Number,
            height: Number,
            id: String,
        },

        methods: {
            render() {
                return {
                    template: new Svg(this.src)
                        .classes(this.classes)
                        .width(this.width)
                        .height(this.height)
                        .id(this.id)
                        .toString()
                };
            }
        }
    };

    class Svg {
        constructor(src) {
            let div = document.createElement('div');
            if (!src.endsWith('.svg')) {
                src += '.svg';
            }
            div.innerHTML = require('../../../img/' + src);

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
            let scripts = Array.from(this.svg.getElementsByTagName('script'));
            let styles = Array.from(this.svg.getElementsByTagName('style'));

            for (let script of scripts) {
                this.svg.removeChild(script);
            }
            for (let style of styles) {
                this.svg.removeChild(style);
            }
        }
    }
</script>
