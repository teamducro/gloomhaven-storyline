<template>
    <img :src="source" @error="this.error"/>
</template>

<script>
    export default {
        props: {
            src: {
                type: String
            }
        },
        data() {
            return {
                source: ''
            }
        },
        mounted() {
            this.source = this.webp();
        },
        watch: {
            src: function (src) {
                this.source = this.webp();
            }
        },
        methods: {
            webp() {
                return this.src.split('.').slice(0, -1) + '.webp';
            },
            error() {
                if (this.source !== this.src) {
                    this.source = this.src;
                }
            }
        }
    }
</script>
