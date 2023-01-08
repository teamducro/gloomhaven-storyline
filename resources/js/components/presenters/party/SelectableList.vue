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
                :filter-closure="filterClosure"
                :width="width"
                @change="(item) => {toggle(item)}">
                <template v-for="(checked, item) in items" v-slot:[slugify(item)]>
                    <div class="w-full flex items-center justify-between"
                         :class="{'opacity-50': isDisabled(item)}">
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
                    <bedge class="mr-2 mt-2 white rounded-md animate__animated"
                           :class="{
                                'cursor-pointer': !appData.read_only,
                                'animate__flipInX': animationsEnabled  && addedItems.includes(item),
                                'animate__flipOutX': animationsEnabled && removedItems.includes(item)
                            }"
                           @click="(e) => {deselect(item)}">
                        {{ item }}
                        <span class="ml-1" v-if="!appData.read_only">×</span>
                    </bedge>
                </slot>
            </span>
        </div>
    </div>
</template>

<script>
import Slugify from "../../../services/Slugify";
import Bedge from "../../elements/Bedge";
import Helpers from "../../../services/Helpers";

export default {
    inject: ['appData'],
    components: {Bedge},
    mixins: [Slugify],
    props: {
        id: String,
        title: String,
        label: String,
        width: String,
        items: Object,
        disabled: Array,
        animations: {
            type: Boolean,
            default: true
        },
        filterClosure: Function
    },
    data() {
        return {
            key: 0,
            rollbackLoaded: false,
            checkedItems: [],
            addedItems: [],
            removedItems: [],
            animationsEnabled: false
        }
    },
    watch: {
        items: {
            handler(items) {
                this.itemsUpdated(items);
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
            this.itemsUpdated(items);
        },
        select(item, select = true) {
            if (this.isDisabled(item)) {
                return;
            }
            this.$set(this.items, item, select);
            this.$refs['rollback'].set(this.items);
            this.rerender();
            this.$emit('update:items', this.items);
            this.$emit('change', this.items);
            this.itemsUpdated(this.items);
        },
        deselect(item) {
            if (this.appData.read_only) {
                return;
            }

            this.select(item, false);
        },
        toggle(item) {
            this.select(item, !this.items[item]);
        },
        isDisabled(item) {
            const checked = this.items[item];
            return !checked && Array.isArray(this.disabled) && this.disabled.includes(item);
        },
        itemsUpdated(items) {
            this.detectChangedItems();
            this.setCheckedItems(items);
            this.rerender();
        },
        rerender() {
            this.key++;
            if (this.key > 1 && this.animations) {
                this.animationsEnabled = true;
            }
        },
        async setCheckedItems(items) {
            this.checkedItems = [];

            for (let id in items) {
                if (items[id] || this.removedItems.includes(id)) {
                    this.checkedItems.push(id);
                }
            }

            // Keep removed items checked for an other 800ms for the remove animation.
            if (this.animationsEnabled && (this.addedItems.length || this.removedItems.length)) {
                let currentAddedItems = [...this.addedItems];
                let currentRemovedItems = [...this.removedItems];
                await Helpers.sleep(800);
                this.checkedItems.forEach((id) => {
                    if (currentRemovedItems.includes(id) && !this.items[id]) {
                        this.$delete(this.checkedItems, this.checkedItems.indexOf(id));
                    }
                });
                this.addedItems = this.addedItems.filter((item) => !currentAddedItems.includes(item));
                this.removedItems = this.removedItems.filter((item) => !currentRemovedItems.includes(item));
            }
        },
        detectChangedItems() {
            if (!this.animationsEnabled || !this.items) {
                return;
            }

            const currentCheckedItems = [...this.checkedItems];
            const newCheckedItems = [];
            for (let id in this.items) {
                if (this.items[id]) {
                    newCheckedItems.push(id);
                }
            }

            // Added items
            const addedItems = newCheckedItems.filter(item => !currentCheckedItems.includes(item));
            this.addedItems = [...this.addedItems, ...addedItems];

            // Removed items
            const removedItems = currentCheckedItems.filter(item => !newCheckedItems.includes(item));
            this.removedItems = [...this.removedItems, ...removedItems];
        }
    }
}
</script>
