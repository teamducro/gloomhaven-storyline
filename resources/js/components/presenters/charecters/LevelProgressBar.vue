<template>
    <div class="w-full" v-if="level > 0 && level < 9">
        <div class="flex items-center">
            <div class="bg-black2-50 h-1 w-full rounded-full relative">
                <div class="absolute left-0 top-0 rounded-full bg-primary h-1 transition-layout"
                     :style="{width: progress+'%'}"></div>
            </div>
            <div class="ml-2 mt-2 flex flex-col leading-4 whitespace-nowrap text-center">
                <span>{{ $t('Lvl') }} {{ level + 1 }}</span>
                <span>{{ levels[level + 1] }} {{ $t('XP') }}</span>
            </div>
        </div>
        <p v-if="progress >= 100">{{ $t('Level up when youre back in town') }}</p>
    </div>
</template>

<script>
export default {
    props: {
        level: Number,
        xp: Number
    },
    data() {
        return {
            levels: {
                1: 0,
                2: 45,
                3: 95,
                4: 150,
                5: 210,
                6: 275,
                7: 345,
                8: 420,
                9: 500
            }
        }
    },
    computed: {
        progress() {
            const currentExp = this.xp - this.levels[this.level];
            const neededExp = this.levels[this.level + 1] - this.levels[this.level];

            return Math.min(Math.max(currentExp / neededExp * 100, 0), 100);
        }
    }
}
</script>
