<template>
    <inline-svg name="storyline" classes="h-screen"/>
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
