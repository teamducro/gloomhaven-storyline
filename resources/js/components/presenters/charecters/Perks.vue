<template>
    <div class="mb-4">
        <h2 class="mb-2">{{ $t('Perks') }}</h2>
        <div class="mb-4">
            <div class="flex" v-for="(perkDescription, perkIndex) in character.perkDescriptions">
                <div :key="'perk-'+perkIndex"
                     class="perk-checkboxes" :class="{'checkbox-groups': perkDescription.linked}">
                    <template v-for="(perk, index) in perks[perkIndex]" :key="index">
                        <checkbox v-if="index < perkDescription.count" group="perks"
                              :id="'perk-'+perkIndex+'-'+index"
                              :checked="perks[perkIndex][index]"
                              @change="(id, isChecked) => {changedPerks(perkIndex, index, isChecked)}"></checkbox>
                    </template>
                </div>
                <p class="ml-2 mt-1 mb-1">
                    <add-links-and-icons :text="$t(perkDescription.desc)"/>
                </p>
            </div>
        </div>
        <h2 class="mb-2">{{ $t('Battle Goals') }}</h2>
        <div class="flex flex-wrap max-w-xs">
            <template v-for="groupIndex in [0, 3, 6, 9, 12, 15]">
                <div class="flex items-center">
                    <checkbox v-for="index in [1, 2, 3]" :key="'check'+(groupIndex+index)" group="checks"
                              :style="index < 3 ? 'transform: scale(0.7)' : ''"
                              :id="'check'+(groupIndex+index)"
                              :checked="checks[(groupIndex+index)]"
                              @change="(id, isChecked) => {changedChecks((groupIndex+index), isChecked)}"></checkbox>
                </div>
            </template>
        </div>
        <h2 v-if="character.masteryDescriptions?.length" class="mt-4 mb-2">{{ $t('Masteries') }}</h2>
        <div v-if="character.masteryDescriptions?.length" class="mb-4">
            <div v-for="(masteryDescription, masteryIndex) in character.masteryDescriptions"
                :key="'mastery-'+masteryIndex"
                class="flex items-center">
                <checkbox group="masteries"
                        :id="'mastery-'+masteryIndex"
                        :checked="masteries[masteryIndex]"
                        @change="(id, isChecked) => {changedMasteries(masteryIndex, isChecked)}"></checkbox>
                <p class="ml-2 mt-1 mb-1">
                    <add-links-and-icons :text="$t(masteryDescription)"/>
                </p>
            </div>
        </div>

        <p v-if="perkCount < minimalPerks">
            {{ $t('You may select an additional perk!') }}
        </p>
    </div>
</template>

<script>
import Character from "../../../models/Character";

export default {
    emits: ['change', 'update:checks', 'update:masteries', 'update:perks'],
    props: {
        character: Character,
        perks: Object,
        checks: Object,
        masteries: Object,
        scenarioPerks: {type: Number, default: 0}
    },
    data() {
        return {}
    },
    mounted() {

    },
    computed: {
        perkCount() {
            return Object.entries(this.perks).reduce((sum, [i, perk]) => sum + perk.filter(Boolean).length, 0);
        },
        minimalPerks() {
            return (this.character.retirements || 0)
                + (this.character.level - 1)
                + this.scenarioPerks
                + collect(this.masteries).filter().count()
                + Math.floor(collect(this.checks).filter().count() / 3);
        }
    },
    methods: {
        changedChecks(index, isChecked) {
            let checks = {...this.checks};
            checks[index] = isChecked;
            this.$emit('update:checks', checks);
            this.$emit('change');
        },
        changedPerks(perkIndex, index, isChecked) {
            let perks = {...this.perks};
            perks[perkIndex][index] = isChecked;
            this.$emit('update:perks', perks);
            this.$emit('change');
        },
        changedMasteries(masteryIndex, isChecked) {
            let masteries = {...this.masteries};
            masteries[masteryIndex] = isChecked;
            this.$emit('update:masteries', masteries);
            this.$emit('change');
        }
    }
}
</script>

<style scoped lang="scss">
// At most two checkboxes per row; more wrap below.
.perk-checkboxes {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    flex-shrink: 0;
    max-width: 80px;
}

.checkbox-groups {
    display: flex;
    padding: 12px;
    .mdc-checkbox {
        padding: 0;
        :deep(.mdc-checkbox__background), :deep(.mdc-checkbox__native-control) {
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
        }
        &:not(:first-child) :deep(.mdc-checkbox__background) {
            border-left-style: dotted;
        }
        &:not(:last-child) :deep(.mdc-checkbox__background) {
            border-right-style: dotted;
        }
    }
}

</style>
