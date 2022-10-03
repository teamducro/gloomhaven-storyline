<template>
    <span v-if="s" class="cursor-pointer inline-flex" @click="open(s.id)">
        <button type="button" v-if="s.isVisible() || s.is_side"
                :class="classes">
            <character-icon class="hover:cursor-pointer" v-if="s.solo" :character="s.solo"/>
            <span v-else>{{ s.id }}</span>
        </button>
        <span class="ml-2" v-if="showName">{{ $t(s.name) }}</span>
    </span>
</template>

<script>
import ScenarioRepository from "../../repositories/ScenarioRepository";
import Scenario from "../../models/Scenario";

export default {
    props: {
        scenario: {
            type: Scenario
        },
        id: {
            type: Number
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
        return {
            s: null,
            scenarioRepository: new ScenarioRepository(),
        };
    },
    mounted() {
        if (this.scenario) {
            this.s = this.scenario;
        }
        if (!this.scenario && this.id) {
            this.s = this.scenarioRepository.find(this.id);
        }
    },
    computed: {
        classes() {
            let classes = {
                'is-small': this.isSmall
            };
            classes[this.s.state] = true;

            return classes;
        }
    },
    methods: {
        open() {
            this.$bus.$emit('open-scenario', {
                id: this.s.id
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

    &.hidden {
        @apply block opacity-50;
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
