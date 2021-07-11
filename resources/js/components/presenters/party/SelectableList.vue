<template>
    <div class="w-full mt-8">
        <div class="mb-2 flex items-center">
            <h2>{{ title }}</h2>
            <rollback v-show="rollbackLoaded" ref="rollback"
                      :value="items"
                      @change="rolledBack"></rollback>
        </div>
        <div class="flex items-center">
            <autocomplete
                :label="label"
                :id="id || slugify(title)"
                :list="Object.keys(items)"
                :width="width"
                @change="(item) => {toggle(item)}">
                <template v-for="(checked, item) in items" v-slot:[slugify(item)]>
                    <div class="w-full flex items-center justify-between">
                        <slot name="label" :item="item">
                            <span>{{ item }}</span>
                        </slot>
                        <span class="material-icons">
                            {{ checked ? 'check_circle_outline' : 'radio_button_unchecked' }}
                        </span>
                    </div>
                </template>
            </autocomplete>

            <slot name="after-field" :checked-items="checkedItems"></slot>
        </div>

        <div :key="key" :id="(id || slugify(title)) + '-bedges'">
            <span v-for="item in checkedItems" :key="item">
                <slot name="item" :item="item">
                    <bedge class="mr-2 mt-2 white cursor-pointer rounded-md"
                           @click="(e) => {deselect(item)}">
                        {{ item }}
                        <span class="ml-1">×</span>
                    </bedge>
                </slot>
            </span>
        </div>
    </div>
</template>

<script>
import Slugify from "../../../services/Slugify";
import Bedge from "../../elements/Bedge";

export default {
    components: {Bedge},
    mixins: [Slugify],
    props: {
        id: String,
        title: String,
        label: String,
        width: String,
        items: Object
    },
    data() {
        return {
            key: 0,
            rollbackLoaded: false,
            checkedItems: []
        }
    },
    watch: {
        items: {
            handler(items) {
                this.setCheckedItems(items);
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        reset() {
            this.$refs['rollback'].reset();
            this.rollbackLoaded = true;
        },
        rolledBack(items) {
            this.$emit('update:items', items);
            this.$emit('change', items);
            this.rerender();
        },
        select(item, select = true) {
            this.$set(this.items, item, select);
            this.$refs['rollback'].set(this.items);
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
            this.setCheckedItems(this.items);
        },
        setCheckedItems(items) {
            this.checkedItems = [];

            for (let id in items) {
                if (items[id]) {
                    this.checkedItems.push(id);
                }
            }
        }
    }
}
</script>
