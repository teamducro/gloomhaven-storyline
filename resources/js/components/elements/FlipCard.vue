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
@reference "../../../sass/tailwind.css";
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

        // The visible face stays in the flow, so the card takes its height (sides may differ in length)
        .front, .back {
            @apply w-full;
            backface-visibility: hidden;
        }

        .back {
            @apply absolute top-0 left-0;
            transform: rotateY(180deg);
        }

        &.flipped {
            .front {
                @apply absolute top-0 left-0;
            }

            .back {
                @apply relative;
            }
        }
    }
}
</style>
