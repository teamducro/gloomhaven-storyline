<template>
    <div class="sm:flex">
        <div>
            <p>{{ $t('Recommended scenario level') }}: <span class="font-title">{{ recommendedLevel }}</span></p>
            <div class="flex flex-wrap">
                <div class="flex flex-col items-center justify-end"
                     v-for="level in levels">
                    <label :for="'l-'+level" class="font-title -mb-1">{{ level }}</label>
                    <radio class="-m-1" :id="'l-'+level" group="level"
                           :key="'l-'+level+'-'+String(isChecked(level))"
                           style="transform: scale(0.7)"
                           :checked="isChecked(level)"
                           @changed="changed"/>
                </div>
            </div>
        </div>

        <table class="border-separate border-spacing-2 sm:ml-8 sm:-mt-2">
            <tr><td>{{ $t('Difficulty') }}</td><td>{{ difficulty }}</td></tr>
            <tr v-for="row in calculateDifficultyTable(level, appData.game)">
                <td>{{ row.label }}</td>
                <td>{{ row.value }}</td>
            </tr>
        </table>
    </div>
</template>

<script>

import SheetCalculations from "../../services/SheetCalculations";

export default {
    mixins: [SheetCalculations],
    inject: ['appData'],
    props: {
        id: {
            type: String
        },
        value: {
            type: Number|null,
            default: null
        },
        characters: {
            type: Object
        }
    },
    data() {
        return {
            recommendedLevel: this.calculateRecommendedLevel(this.characters)
        }
    },
    watch: {
        characters() {
            this.recommendedLevel = this.calculateRecommendedLevel(this.characters);
        }
    },
    mounted() {

    },
    computed: {
        difficulty() {
            return this.calculateDifficulty(this.level, this.recommendedLevel);
        },
        level() {
            const level = this.recommendedLevel + (this.value || 0);
            return Math.max(0, Math.min(7, level));
        },
        levels() {
            const levels = [];

            for (let i = this.recommendedLevel - 3; i <= this.recommendedLevel + 3; i++) {
                if (i >= 0 && i <= 7) {
                    levels.push(i);
                }
            }

            return levels;
        }
    },
    methods: {
        changed(id) {
            let level = parseInt(id.split('-')[1]);

            let toSave = level - this.recommendedLevel;
            toSave = Math.max(-3, Math.min(3, toSave));

            this.$emit('update:value', toSave);
            this.$emit('change', toSave);
        },
        isChecked(level) {
            return this.level == level;
        }
    }
}
</script>

<style scoped>
.border-spacing-2 {
    border-spacing: 0.5rem 0.5rem;
}
</style>
