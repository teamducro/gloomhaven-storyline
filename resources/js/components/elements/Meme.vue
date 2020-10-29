<template>
    <webp width="300" :src="`/img/memes/${meme}.jpg`"></webp>
</template>

<script>
    export default {
        data() {
            return {
                meme: Math.floor(Math.random() * 6)
            }
        }
    }
</script>
