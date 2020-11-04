<template>
    <div class="flex flex-wrap" :class="{'sm:flex-row-reverse': reverse}">
        <div class="w-5/6 sm:w-1/2 p-6">
            <div class="flex items-center mb-4">
                <slot name="title"></slot>
            </div>
            <slot name="left"></slot>
        </div>
        <div class="w-full sm:w-1/2 p-6">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        reverse: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            appUrl: process.env.MIX_APP_URL,
        }
    },
    mounted() {
    },
    methods: {}
}
</script>
