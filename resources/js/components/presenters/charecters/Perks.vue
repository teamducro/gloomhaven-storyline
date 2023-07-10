<template>
    <div class="mb-4">
        <h2 class="mb-2">{{ $t('Perks') }}</h2>
        <div class="mb-4">
            <div class="flex" v-for="(perkDescription, perkIndex) in character.perkDescriptions">
                <div v-for="(perk, index) in perks[perkIndex]"
                          v-if="index < perkDescription.count"
                          :key="'perk-'+perkIndex+'-'+index"
                          class="checkbox-groups">
                    <checkbox v-for="i in perkDescription.size"
                          :key="i" group="perks"
                          :id="'perk-'+perkIndex+'-'+index+'-'+i"
                          :checked="perks[perkIndex][index]"
                          @change="(id, isChecked) => {changedPerks(perkIndex, index, isChecked)}"></checkbox>
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
        <h2 v-if="masteries" class="mt-4 mb-2">{{ $t('Masteries') }}</h2>
        <div v-if="masteries" class="mb-4">
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
    props: {
        character: Character,
        perks: Object,
        checks: Object,
        masteries: Object
    },
    data() {
        return {}
    },
    mounted() {

    },
    computed: {
        perkCount() {
            return Object.entries(this.perks).reduce((sum, [i, perk]) => sum + this.character.perkDescriptions[i].size * perk.filter(Boolean).length, 0);
        },
        minimalPerks() {
            return (this.character.retirements || 0)
                + (this.character.level - 1)
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
.checkbox-groups {
    display: flex;
    padding: 12px;
}
.checkbox-groups .mdc-checkbox {
    margin: -12px;
}
.checkbox-groups .mdc-checkbox:not(:first-child) ::v-deep .mdc-checkbox__background {
    border-left-color: transparent;
}
.checkbox-groups .mdc-checkbox:not(:last-child) ::v-deep .mdc-checkbox__background {
    border-right-style: dotted;
}

</style>
