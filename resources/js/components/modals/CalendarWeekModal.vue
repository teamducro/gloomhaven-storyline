<template>
    <div>
        <modal ref="modal" :title="title">
            <div v-if="calendar && week" slot="content" class="w-full h-full outline-none relative">
                <checkbox-with-label
                    class="mt-4" id="calendar-week-check" group="calendar-week"
                    :label="$t('Has passed')"
                    :checked="calendar.week >= week"
                    @change="changedWeek"/>

                <ul v-if="calendar.sections[week] && calendar.sections[week].length" class="my-4 list-none" :key="'list-'+hash">
                    <li v-for="(section, index) in calendar.sections[week]">
                        <a href="#" class="inline-flex items-center text-white py-2 pr-4" @click.prevent.stop="removeSection(index)">
                            <inline-svg class="w-3 mr-2 inline-block" src="icons/book"/>
                            {{ section }}
                            <span class="ml-2" v-if="!appData.read_only">×</span>
                        </a>
                    </li>
                </ul>
                <p v-else class="my-4" :key="hash">{{ $t('No sections added') }}</p>

                <div class="flex items-end">
                    <counter-section
                        ref="add-section"
                        :max="200"
                        :min="1"
                        :step=".1"
                        :title="$t('Add section')"
                        :value.sync="newSection"/>

                    <button @click="addSection" :disabled="appData.read_only"
                            class="ml-4 mdc-button mdc-button--raised">
                        <i class="material-icons mdc-button__icon">add</i>
                        <span class="mdc-button__label">{{ $t('Add') }}</span>
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

import md5 from "js-md5";

export default {
    inject: ['appData'],
    data() {
        return {
            calendar: null,
            week: null,
            newSection: 1,
            hash: ''
        }
    },
    mounted() {
        this.$bus.$on('open-calendar-week', this.open);
        this.$bus.$on('close-item', this.close);
        this.$bus.$on('game-selected', this.close);
    },
    computed: {
        title() {
            return this.$t('Week') + ' ' + this.week + ' ' + (this.isSummer ? this.$t('Summer') : this.$t('Winter'));
        },
        isSummer() {
            const remainder = this.week % 20;
            return (remainder % 20 >= 0 && remainder % 20 <= 9);
        }
    },
    methods: {
        addSection() {
            if (this.newSection > 0) {
                const sections = this.calendar.sections[this.week] || [];
                if (sections.includes(this.newSection)) {
                    return;
                }
                sections.push(this.newSection);
                sections.sort((a, b) => a - b);
                this.calendar.sections[this.week] = sections;
                this.newSection = 1;
                this.update();
            }
        },
        removeSection(index) {
            this.calendar.sections[this.week].splice(index, 1);
            this.update();
        },
        changedWeek(id, isChecked) {
            let w = this.week;
            if (!isChecked) {
                w = w - 1;
            }
            this.calendar.week = w;
            this.update();
        },
        update() {
            this.makeHash();
            this.$bus.$emit('calendar-updated', this.calendar);
        },
        open(data) {
            this.calendar = data.calendar;
            this.week = data.week;
            this.makeHash();

            this.$refs['modal'].open();
        },
        makeHash() {
            this.hash = md5(JSON.stringify(this.calendar.sections[this.week] || []));
        },
        close() {
            this.calendar = null;
            this.week = null;
            this.$refs['modal'].close();
        }
    }
}
</script>
