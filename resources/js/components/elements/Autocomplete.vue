<template>
    <div>
        <dropdown ref="dropdown" align="left" :should-toggle="false" :auto-disable="true">
            <template v-slot:trigger>
                <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="field">
                    <span class="mdc-text-field__ripple"></span>
                    <input class="mdc-text-field__input" :aria-labelledby="id" :disabled="isFieldDisabled"
                           type="text" :name="id" autocomplete="off"
                           v-model="query" @keyup="filter">
                    <span class="mdc-floating-label" :id="id">{{ label }}</span>
                    <span class="mdc-line-ripple"></span>
                </label>
            </template>

            <div class="mdc-list z-10" :class="[width]">
                <ul v-if="list.length" class="mdc-list" aria-hidden="true"
                    aria-orientation="vertical" tabindex="-1">
                    <li v-for="(item, i) in items" :key="i"
                        class="mdc-list-item" @click="select(item)">
                        <span class="mdc-list-item__text w-full"
                              :class="{'opacity-50': isDisabled(item)}">
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
import Helpers from "../../services/Helpers";

export default {
    inject: ['appData'],
    mixins: [Slugify],
    props: {
        id: {type: String},
        label: {type: String},
        list: {type: Array},
        disabled: {type: Array},
        autoDisable: {type: Boolean, default: true},
        maxItems: {default: 10},
        width: {type: String, default: 'w-40'},
        autoClose: {type: Boolean, default: false},
        filterClosure: {
            type: Function,
            default: (query) => {
                return (item) => {
                    return Helpers.sanitize(item).startsWith(query);
                }
            }
        },
    },
    data() {
        return {
            query: '',
            items: [],
            field: null
        }
    },
    mounted() {
        this.field = new MDCTextField(this.$refs['field']);
    },
    computed: {
        isFieldDisabled() {
            return this.autoDisable && this.appData.read_only;
        }
    },
    watch: {
        list: {
            handler(list) {
                this.filter();
            },
            immediate: true
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
            query = Helpers.sanitize(query).replace(/^0+/, '');

            if (query.length) {
                return this.list.filter(this.filterClosure(query));
            }

            return this.list;
        },
        isDisabled(item) {
            return Array.isArray(this.disabled) && (this.disabled.includes(item) || this.disabled.includes(parseInt(item)));
        },
        select(item) {
            if (this.isDisabled(item)) {
                return;
            }

            this.$emit('change', item);
            if (this.autoClose) {
                this.close();
            }
        },
        close() {
            this.$refs["dropdown"].close();
        },
    }
}
</script>
