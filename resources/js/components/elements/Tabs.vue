<template>
    <div>
        <div v-if="enableMobile" class="sm:hidden">
            <select :id="id" :name="id" @change="mobileSelect"
                    class="block w-full bg-transparent font-title text-md -ml-1">
                <option v-for="tab in tabs" :selected="selected === tab" :value="tab">{{ tab }}</option>
            </select>
        </div>
        <div :class="{'hidden sm:inline-block': enableMobile}">
            <div class="mb-4">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                    <a v-for="(tab, index) in tabs" href="#" @click="select(tab, $event)"
                       class="group inline-flex items-center font-title text-md"
                       :class="{'text-white': selected === tab, 'text-white2-50 hover:text-white2-75': selected !== tab}">
                        <span v-if="icons[index]" class="material-icons i-text-md mr-2">{{ icons[index] }}</span>
                        <span>{{ tab }}</span>
                    </a>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: 'tabs'
        },
        tabs: {
            type: Array,
            default: () => []
        },
        icons: {
            type: Array,
            default: () => []
        },
        urls: {
            type: Array,
            default: () => []
        },
        active: {
            type: String,
            default: null
        },
        enableMobile: {
            type: Boolean,
            default: false
        },
    },
    mounted() {
        if (this.active) {
            this.selected = this.active;
        }
        if (!this.selected && this.tabs.length) {
            this.selected = this.tabs[0];
        }
    },
    data() {
        return {
            selected: null
        }
    },
    methods: {
        select(tab, e) {
            e.preventDefault();
            this.selected = tab;

            if (this.urls[this.tabs.indexOf(tab)]) {
                this.$router.push(this.urls[this.tabs.indexOf(tab)]);
            } else {
                this.$emit('select', tab);
            }
        },
        mobileSelect(e) {
            this.select($(e.target).val(), e);
        }
    }
}
</script>
