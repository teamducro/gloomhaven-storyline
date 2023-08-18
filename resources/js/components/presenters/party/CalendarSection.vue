<template>
    <div :key="hash" class="mt-4 bg-dark-background grid grid-cols-5 xs:grid-cols-10 md:grid-cols-20 gap-px">
        <div v-for="week in weeks" class="outline-gray relative flex flex-col px-1 min-h-8"
             :class="{
                'cursor-pointer': !appData.read_only,
                'bg-orange-1000': isSummer(week),
                'bg-blue-1000': isWinter(week),
            }" @click="openWeek(week)">
            <span class="flex items-center gap-1 p-1 text-sm" v-for="section in calendar.sections[week] || []">
                {{ section }}
            </span>
            <inline-svg v-if="calendar.week >= week" class="absolute w-6 text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="icons/x"/>
        </div>
    </div>
</template>

<script>

const md5 = require('js-md5');

export default {
    inject: ['appData'],
    props: {
        calendar: {
            type: Object,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentCalendar: this.calendar,
            hash: '',
            weeks: Array.from({ length: 80 }).map((e, i) => i+1)
        }
    },
    mounted() {
        this.hash = md5(JSON.stringify(this.currentCalendar));
        this.$bus.$on('calendar-updated', this.setCalendar);
    },
    destroyed() {
        this.$bus.$off('calendar-updated', this.setCalendar);
    },
    watch: {
        calendar: {
            handler(calendar) {
                this.currentCalendar = calendar;
            },
            deep: true
        },
        currentCalendar: {
            handler(calendar) {
                this.update(calendar);
            },
            deep: true
        },
    },
    methods: {
        setCalendar(calendar) {
            if (this.appData.read_only)
                return;

            this.currentCalendar = calendar;
            this.update(calendar);
        },
        openWeek(week) {
            if (this.appData.read_only)
                return;

            this.$bus.$emit('open-calendar-week', {
                week,
                calendar: this.calendar
            });
        },
        update(calendar) {
            this.hash = md5(JSON.stringify(calendar));
            this.$emit('update:calendar', calendar);
            this.$emit('change', calendar);
        },
        isSummer(week) {
            const remainder = week % 20;
            return (remainder % 20 > 0 && remainder % 20 <= 10);
        },
        isWinter(week) {
            return !this.isSummer(week);
        }
    }
}
</script>
