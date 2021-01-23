<template>
    <div>
        <dropdown ref="dropdown" align="left" :should-toggle="false">
            <template v-slot:trigger>
                <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="field">
                    <span class="mdc-text-field__ripple"></span>
                    <input class="mdc-text-field__input" :aria-labelledby="id"
                           type="text" :name="id"
                           v-model="query" @keyup="filter">
                    <span class="mdc-floating-label" :id="id">{{ label }}</span>
                    <span class="mdc-line-ripple"></span>
                </label>
            </template>

            <div class="mdc-list w-40 z-10">
                <ul v-if="list.length" class="mdc-list" aria-hidden="true"
                    aria-orientation="vertical" tabindex="-1">
                    <li v-for="(item, i) in items" :key="i"
                        class="mdc-list-item cursor-pointer" @click="select(item)">
                        <span class="mdc-list-item__text w-full">
                            <slot :name="slugify(item)">
                                {{ item }}
                            </slot>
                        </span>
                    </li>
                </ul>
            </div>
        </dropdown>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";
import Slugify from "../../services/Slugify";

export default {
    mixins: [Slugify],
    props: {
        id: {type: String},
        label: {type: String},
        list: {type: Array},
        maxItems: {default: 10}
    },
    data() {
        return {
            query: '',
            items: []
        }
    },
    mounted() {
        this.field = new MDCTextField(this.$refs['field']);
    },
    watch: {
        list(list) {
            this.filter();
        }
    },
    methods: {
        filter() {
            let filtered = (this.query.length)
                ? this.search(this.query)
                : this.list;
            this.items = filtered.slice(0, this.maxItems)
        },
        search(query) {
            query = query.trim().toLowerCase().replace('-', ' ');
            return this.list.filter((item) => {
                return item.toLowerCase().replace('-', ' ').startsWith(query);
            });
        },
        select(item) {
            this.$emit('change', item);
        }
    }
}
</script>
