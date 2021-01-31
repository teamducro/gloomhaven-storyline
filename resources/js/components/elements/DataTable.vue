<template>
    <table class="min-w-full divide-y">
        <thead class="bg-black2-25">
        <tr>
            <th v-for="head in columns" scope="col"
                class="p-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                <span class="flex items-center">
                    {{ head.name }}
                    <span v-if="sort === head.id" class="material-icons">arrow_drop_down</span>
                </span>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in rows" :key="index"
            class="whitespace-nowrap text-sm text-white2-75" :class="{'bg-black2-25': index%2 === 0}">
            <td v-for="column in columns" :key="column.id+index"
                class="relative p-3 overflow-hidden">
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
        searchable: {
            type: Array,
            default: () => []
        },
        sortable: {
            type: Array,
            default: () => []
        },
        initialSearch: ""
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
            if (!this.search) {
                return {};
            }

            let result = {};
            this.searchable.forEach(key => {
                result[key] = (input) => (input ? input.toString().toLowerCase().includes(this.search.toString().toLowerCase()) : false);
            });
            return result;
        },
        filteredData() {
            const search = this.searchFunctions
            const searchedCols = Object.keys(search)
            const colMatch = (row, colName) => {
                const colVal = row[colName]
                return search[colName](colVal)
            }
            const rowMatch = (row) => (
                !searchedCols.some(col => !colMatch(row, col))
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
                this.search = newVal
            },
            immediate: true
        }
    },
    methods: {
        resetState() {
            const initialData = this.$options.data()
            this.sort = initialData.sort
            this.ascending = initialData.ascending
            this.search = this.initialSearch
        },
        sortBy(column, event) {
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
