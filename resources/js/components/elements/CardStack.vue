<template>
    <span @click="click" class="inline-block relative">
        <webp :src="src" :class="'w-'+width" class="z-1 relative"/>
        <webp v-if="count > 1 && index < maxCount" v-for="index in maxCount" :key="'stack-'+index"
              :src="src" :class="'w-'+width" class="absolute z-0 top-0 left-0" :style="rotation(index)"/>
    </span>
</template>

<script>

export default {
    props: {
        src: String,
        width: {
            type: Number,
            default: 32
        },
        count: {
            type: Number,
            default: 5
        },
    },
    data() {
        return {

        }
    },
    mounted() {

    },
    computed: {
        maxCount() {
            return Math.min(this.count, 5);
        }
    },
    methods: {
        rotation(index) {
            const x = this.maxCount - index
            let deg = x * 2 * -1

            return 'transform: rotate('+deg+'deg);';
        },
        click() {
            this.$emit('click');
        }
    }
}
</script>
