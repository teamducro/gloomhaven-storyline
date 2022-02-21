<template>
    <div class="mb-4">
        <h2 class="mb-2">{{ $t('Perks') }}</h2>
        <div class="mb-4">
            <div class="flex" v-for="(perkDescription, perkIndex) in character.perkDescriptions">
                <checkbox v-for="(perk, index) in perks[perkIndex]"
                          v-if="index < perkDescription.count"
                          :key="'perk-'+perkIndex+'-'+index" group="perks"
                          :id="'perk-'+perkIndex+'-'+index"
                          :checked="perks[perkIndex][index]"
                          @change="(id, isChecked) => {changedPerks(perkIndex, index, isChecked)}"></checkbox>
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

        <p v-if="perkCount < minimalPerks">
            {{ $t('You may select an additional perk!') }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        character: Object,
        perks: Object,
        checks: Object
    },
    data() {
        return {}
    },
    mounted() {

    },
    computed: {
        perkCount() {
            return collect(this.perks).flatten().filter().count();
        },
        minimalPerks() {
            return this.character.retirements + this.character.level - 1 + Math.floor(collect(this.checks).filter().count() / 3);
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
        }
    }
}
</script>
