<template>
    <div class="min-w-full rounded-lg overflow-hidden">
        <table class="min-w-full divide-y">
            <thead class="bg-black2-25">
            <tr>
                <th v-for="column in columns" scope="col"
                    class="px-1 py-2 md:p-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    :class="headClasses(column)"
                    @click="sortBy(column.id, $event)">
                <span class="flex items-center">
                    {{ $t(column.name) }}

                    <span v-if="sortable.includes(column.id)" class="material-icons !text-sm text-white2-50">
                        {{ sort !== column.id ? 'unfold_more' : (!ascending ? 'expand_more' : 'expand_less') }}
                    </span>
                </span>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in rows" :key="index"
                class="text-sm text-white2-75"
                :class="rowClasses(index)">
                <slot name="row" :row="row">
                    <td v-for="column in columns" :key="column.id+index"
                        class="relative px-1 py-2 md:p-3 overflow-hidden"
                        :class="columnClasses(column)"
                        @click="$emit('rowClick', row)">
                        <slot :name="column.id" :value="row[column.id]" :row="row">
                            <webp v-if="String(row[column.id]).startsWith('/img')" :src="row[column.id]" width="20"/>
                            <span v-else-if="typeof row[column.id] === 'boolean'">
                                <span v-if="row[column.id] === true" class="material-icons">done</span>
                            </span>
                            <span v-else-if="translatable.includes(column.id)">{{ $t(row[column.id]) }}</span>
                            <span v-else>{{ row[column.id] }}</span>
                        </slot>
                    </td>
                </slot>
            </tr>
            </tbody>
        </table>
        <p class="px-1 md:px-3 pb-2 bg-black2-25" v-if="loaded && rows.length <= 0">
            {{ noResults }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        columns: {
            type: Array,
            default: () => []
        },
        sortable: {
            type: Array,
            default: () => []
        },
        translatable: {
            type: Array,
            default: () => []
        },
        initialSearch: {
            type: [Object, Function],
            default: () => {
                return {}
            }
        },
        sortFunctions: {
            type: Object,
            default: () => {
                return {}
            }
        },
        oddClass: {
            type: String,
            default: ''
        },
        evenClass: {
            type: String,
            default: 'bg-black2-25'
        },
        noResults: {
            type: String,
            default: 'No results' // pass value to translate
        }
    },
    data() {
        return {
            sort: undefined,
            ascending: true, // false = descending
            search: this.initialSearch,
            loaded: false
        }
    },
    mounted() {
        setTimeout(() => {
            this.loaded = true;
        }, 300);
    },
    computed: {
        searchFunctions() {
            // search has a callback function to filter the row on
            if (typeof this.search === 'function') {
                return this.search;
            }

            // Build search functions per column
            const keys = Object.keys(this.search)
            let result = {}
            keys.forEach(key => {
                const searchString = this.search[key]
                if (!searchString) {
                    return
                }
                result[key] = (input) => (input ? input.toString().toLowerCase().includes(searchString.toString().toLowerCase()) : false);
            });
            return result;
        },
        filteredData() {
            const search = this.searchFunctions

            // Filter based on search function
            if (typeof search === 'function') {
                return this.data.filter(row => search(row))
            }

            // Filter rows based on column values matching values in search object
            const searchedColumns = Object.keys(search)
            const colMatch = (row, colName) => {
                const colVal = row[colName]
                return search[colName](colVal)
            }
            const rowMatch = (row) => (
                !searchedColumns.some(col => !colMatch(row, col))
            )
            return this.data.filter(row => rowMatch(row))
        },
        filteredAndSortedData() {
            const rows = this.filteredData
            if (this.sort) {
                let col = this.sort

                // Custom sort function
                if (typeof this.sortFunctions[col] === 'function') {
                    rows.sort((a, b) => {
                        return this.ascending ? this.sortFunctions[col](a, b) : this.sortFunctions[col](b, a);
                    });
                } else {
                    // Sort on other value then column
                    if (typeof this.sortFunctions[col] === 'string') {
                        col = this.sortFunctions[col];
                    }

                    // default sort strings
                    if (rows.length && typeof rows[0][col] === 'string') {
                        rows.sort((a, b) => {
                            return this.ascending ? new Intl.Collator().compare(a[col], b[col]) : new Intl.Collator().compare(b[col], a[col]);
                        });
                    } else {
                        // default sort numbers
                        rows.sort((a, b) => {
                            return this.ascending ? a[col] - b[col] : b[col] - a[col];
                        });
                    }
                }
            }
            return rows
        },
        rows() {
            return this.filteredAndSortedData
        }
    },
    watch: {
        data: {
            handler() {
                this.resetState()
            },
            deep: true
        },
        columns: {
            handler() {
                this.resetState()
            },
            deep: true
        },
        initialSearch: {
            handler(newVal) {
                this.search = typeof newVal === 'function' ? newVal : Object.assign({}, newVal)
            },
            deep: true,
            immediate: true
        },
    },
    methods: {
        resetState() {
            const initialData = this.$options.data()
            this.sort = initialData.sort
            this.ascending = initialData.ascending
            this.search = typeof this.initialSearch === 'function' ? this.initialSearch : Object.assign({}, this.initialSearch)
        },
        sortBy(column, event) {
            if (!this.sortable.includes(column)) {
                return;
            }

            event.preventDefault()
            if (this.sort === column) {
                this.ascending = !this.ascending
            } else {
                this.sort = column
                this.ascending = true
            }
        },
        columnClasses(column) {
            let classes = {};
            if (column.classes) {
                classes[column.classes] = true;
            }

            return classes;
        },
        headClasses(column) {
            return Object.assign(this.columnClasses(column), {'cursor-pointer': this.sortable.includes(column.id)});
        },
        rowClasses(index) {
            let classes = {};

            let rowClass = index % 2 === 0 ? this.oddClass : this.evenClass;
            if (rowClass) {
                classes[rowClass] = true;
            }

            return classes;
        }
    }
}
</script>
