<template>
    <inline-svg :src="'characters/' + character"
                :classes="['h-full', 'w-full']"/>
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
