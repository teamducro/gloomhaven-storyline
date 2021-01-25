<template>
    <div class="w-full mt-8">
        <h2>{{ title }}</h2>
        <autocomplete
            :label="label"
            :id="id || slugify(title)"
            :list="Object.keys(items)"
            @change="(item) => {toggle(item)}">
            <template v-for="(checked, item) in items" v-slot:[slugify(item)]>
                <div class="w-full flex items-center justify-between">
                    <span>{{ item }}</span>
                    <span class="material-icons">
                        {{ checked ? 'check_circle_outline' : 'radio_button_unchecked' }}
                    </span>
                </div>
            </template>
        </autocomplete>
        <div :key="key">
            <bedge v-for="(checked, item) in items" v-if="checked" :key="item"
                   class="mr-2 mt-2 white cursor-pointer rounded-md"
                   @click="(e) => {deselect(item)}">
                {{ item }}
                <span class="ml-1">×</span>
            </bedge>
        </div>
    </div>
</template>

<script>
import Slugify from "../../../services/Slugify";

export default {
    mixins: [Slugify],
    props: {
        id: String,
        title: String,
        label: String,
        items: Object
    },
    data() {
        return {
            key: 0
        }
    },
    methods: {
        select(item, select = true) {
            this.$set(this.items, item, select);
            this.rerender();
            this.$emit('update:items', this.items);
            this.$emit('change', this.items);
        },
        deselect(item) {
            this.select(item, false);
        },
        toggle(item) {
            this.select(item, !this.items[item]);
        },
        rerender() {
            this.key++;
        },
    }
}
</script>
