<template>
    <inline-svg :src="'characters/' + character"/>
</template>

<script>
    export default {
        props: {
            character: String
        },
        data() {
            return {}
        }
    }
</script>
