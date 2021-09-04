<template>
    <div class="flip-card">
        <div class="inner" :class="{flipped: flipped}">
            <div class="front">
                <slot name="front"></slot>
            </div>
            <div class="back">
                <slot name="back"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        flipped: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped lang="scss">
.flip-card {
    @apply bg-transparent;
    perspective: 1000px;

    .inner {
        @apply relative w-full h-full text-center shadow;
        transition: transform 0.6s;
        transform-style: preserve-3d;

        &.flipped {
            transform: rotateY(180deg);
        }

        .front, .back {
            @apply absolute w-full h-full;
            backface-visibility: hidden;
        }

        .back {
            transform: rotateY(180deg);
        }
    }
}
</style>
