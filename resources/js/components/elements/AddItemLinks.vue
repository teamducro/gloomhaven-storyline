<template>
    <component v-bind:is="render()"></component>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        }
    },
    methods: {
        render() {
            const output = this.addItemLinks(this.text);

            return {
                template: `<span>${output}</span>`
            };
        },
        addItemLinks(text) {
            if (text.includes('(Item')) {
                let results = text.match(/(“[\w\s]+”[\w\s]+\(Item [\d]+\))/g);
                results.forEach((item) => {
                    const id = item.replace(/[\D+]/g, '');
                    text = text.replace(item, `<a class="link" href="#" @click.prevent="$bus.$emit('open-item', {id:${id}})">${item}</a>`);
                });
            }

            return text;
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
