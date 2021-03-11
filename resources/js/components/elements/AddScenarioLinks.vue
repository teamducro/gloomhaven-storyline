<template>
    <component v-bind:is="render()"></component>
</template>

<script>
import ScenarioTextParser from "../../services/ScenarioTextParser";
import ScenarioRepository from "../../repositories/ScenarioRepository";

export default {
    props: {
        text: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            scenarioTextParser: new ScenarioTextParser(),
            scenarioRepository: new ScenarioRepository()
        }
    },
    methods: {
        render() {
            let output = this.text;
            let scenarios = {};

            this.scenarioTextParser.parse(this.text).each((name, id) => {
                const scenario = this.scenarioRepository.find(id);
                if (scenario) {
                    if (scenario.isVisible()) {
                        scenarios[id] = scenario;
                        output = output.replace(name, `<scenario-number :scenario="scenarios[${id}]"/>`);
                    } else {
                        output = output.replace(name, 'Hidden Scenario');
                    }
                }
            });

            return {
                data() {
                    return {
                        scenarios
                    }
                },
                template: `<span>${output}</span>`
            };
        }
    }
}
</script>

<style scoped lang="scss">
.bedge {
    @apply top-0 left-0 font-bold inline-flex relative items-center px-2 py-.5 text-sm font-medium leading-5 bg-green-100 text-green-800;

    &.expired {
        @apply bg-red-100 text-red-800;
    }

    &.white {
        @apply bg-gray-100 text-gray-800;
    }

    &:not([class*='rounded']) {
        @apply rounded-full;
    }
}
</style>
