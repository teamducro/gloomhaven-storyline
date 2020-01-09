<template>
    <div>
        <button @click="open" class="mdc-button mdc-button--raised">#1 Black Barrow</button>
    </div>
</template>

<script>
    export default {
        mounted() {

        },
        methods: {
            open() {
                window.bus.$emit('open-scenario', {
                    id: 1
                });
            }
        }
    }
</script>
