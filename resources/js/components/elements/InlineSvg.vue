<script>
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
            return this.svg.outerHTML;
        }
    }

    export default {
        props: ['src', 'classes', 'width', 'height', 'id'],

        render(h) {
            return h('div', {
                domProps: {
                    innerHTML: new Svg(this.src)
                        .classes(this.classes)
                        .width(this.width)
                        .height(this.height)
                        .id(this.id)
                }
            });
        }
    };
</script>
