<template>
    <table class="min-w-full divide-y">
        <thead class="bg-black2-25">
        <tr>
            <th v-for="head in columns" scope="col"
                class="px-1 py-2 md:p-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                :class="{'cursor-pointer': sortable.includes(head.id)}"
                @click="sortBy(head.id, $event)">
                <span class="flex items-center">
                    {{ head.name }}
                    <span v-if="sort !== head.id && sortable.includes(head.id)"
                          class="material-icons">unfold_more</span>
                    <span v-else-if="sort === head.id && !ascending" class="material-icons">expand_more</span>
                    <span v-else-if="sort === head.id && ascending" class="material-icons">expand_less</span>
                </span>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in rows" :key="index"
            class="whitespace-nowrap text-sm text-white2-75" :class="{'bg-black2-25': index%2 === 0}">
            <td v-for="column in columns" :key="column.id+index"
                class="relative px-1 py-2 md:p-3 overflow-hidden">
                <slot :name="column.id" :value="row[column.id]" :row="row">
                    <webp v-if="String(row[column.id]).startsWith('img')" :src="row[column.id]" width="20"/>
                    <span v-else>{{ row[column.id] }}</span>
                </slot>
            </td>
        </tr>
        </tbody>
    </table>
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
        initialSearch: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            sort: undefined,
            ascending: true, // false = descending
            search: this.initialSearch
        }
    },
    computed: {
        searchFunctions() {
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
                const col = this.sort
                if (this.ascending) {
                    rows.sort((a, b) => (a[col] > b[col]) - (a[col] < b[col]))
                } else {
                    rows.sort((b, a) => (a[col] > b[col]) - (a[col] < b[col]))
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
                this.search = Object.assign({}, newVal)
                console.log('test', this.search);
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
            this.search = Object.assign({}, this.initialSearch)
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
        }
    }
}
</script>
