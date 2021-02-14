<template>
    <component v-bind:is="render()"></component>
</template>

<script>
import ItemTextParser from "../../services/ItemTextParser";
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
            itemTextParser: new ItemTextParser()
        }
    },
    methods: {
        render() {
            let output = this.text;

            this.itemTextParser.parse(this.text).each((item, id) => {
                output = output.replace(item, `<a class="link" href="#" @click.prevent="$bus.$emit('open-item', {id:${id}})">${item}</a>`);
            })

            return {
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
