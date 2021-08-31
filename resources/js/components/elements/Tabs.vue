<template>
    <div>
        <!-- Mobile tabs -->
        <div class="relative xs:hidden pb-2 mb-4 border-b border-white2-25">
            <select :id="id" :name="id" @change="mobileSelect"
                    class="block w-full bg-transparent absolute opacity-0 font-title text-md -ml-1">
                <option v-for="tab in tabs" :selected="selected === tab" :value="tab">{{ tab }}</option>
            </select>
            <label v-if="selected" :for="id" class="flex items-center">
                <span v-if="icons[tabs.indexOf(selected)]" class="material-icons i-text-md mr-2"
                      :class="{'transform rotate-180': icons[tabs.indexOf(selected)] === 'style'}">
                            {{ icons[tabs.indexOf(selected)] }}
                </span>
                <span class="font-title">{{ selected }}</span>
                <span class="ml-auto material-icons">keyboard_arrow_down</span>
            </label>
        </div>

        <!-- Desktop tabs -->
        <div class="pb-2 border-b border-white2-25 hidden xs:inline-block">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <a v-for="(tab, index) in tabs" href="#" @click="select(tab, $event)"
                   class="group inline-flex items-center font-title text-md transition-colors"
                   :class="{'text-white': selected === tab, 'text-white2-50 hover:text-white2-75': selected !== tab}">
                        <span v-if="icons[index]" class="material-icons !text-md mr-2"
                              :class="{'transform rotate-180': icons[index] === 'style'}">
                            {{ icons[index] }}
                        </span>
                    <span>{{ tab }}</span>
                </a>
            </nav>
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
        }
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
            if (this.selected === tab) {
                return;
            }
            this.selected = tab;

            if (this.urls[this.tabs.indexOf(tab)]) {
                this.$router.push(this.urls[this.tabs.indexOf(tab)]);
            } else {
                this.$emit('select', tab);
            }
        },
        mobileSelect(e) {
            this.select(e.target.value, e);
        }
    }
}
</script>
