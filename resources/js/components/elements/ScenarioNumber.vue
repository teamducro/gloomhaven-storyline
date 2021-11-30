<template>
    <span>
        <button type="button" v-if="scenario.isVisible()"
                @click="open(scenario.id)"
                :class="classes">
            {{ scenario.id }}
        </button>
        <span v-if="showName">{{ scenario.name }}</span>
    </span>
</template>

<script>
export default {
    props: {
        scenario: {
            type: Object
        },
        isSmall: {
            type: Boolean,
            default: true
        },
        showName: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    computed: {
        classes() {
            let classes = {
                'is-small': this.isSmall
            };
            classes[this.scenario.state] = true;

            return classes;
        }
    },
    methods: {
        open() {
            this.$bus.$emit('open-scenario', {
                id: this.scenario.id
            });
        }
    }
}
</script>
<style lang="scss" scoped>
button {
    @apply font-title text-white bg-black rounded-full h-8 w-8 leading-8 text-center relative border border-white;

    &.is-small {
        @apply text-xs h-6 w-6 leading-6;
    }

    &.incomplete {
        @apply border-complete border-2;
    }

    &.blocked {
        @apply border-incomplete;
        &:before {
            @apply absolute leading-none text-incomplete;
            content: '×';
            top: -0.75rem;
            left: -0.2rem;
            font-size: 1.25rem;
            font-family: Arial, sans-serif;
        }

        &.is-small:before {
            font-size: 1rem;
        }
    }

    &.required {
        @apply border-required;
        &:before {
            @apply absolute leading-none text-required;
            content: '!';
            top: -0.6rem;
            left: 0;
            font-size: 0.75rem;
            font-weight: bold;
        }
    }
}
</style>
