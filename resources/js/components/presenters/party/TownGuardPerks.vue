<template>
    <div>
        <h2 class="mb-2 md:ml-2">{{ $t('Town Guard Perks') }}</h2>
        <div class="flex flex-wrap max-w-xs">
            <template v-for="groupIndex in [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42]">
                <div class="flex items-center">
                    <checkbox v-for="index in [1, 2, 3]" :key="'check'+(groupIndex+index)" group="checks"
                              :style="index < 3 ? 'transform: scale(0.7)' : ''"
                              :id="'check'+(groupIndex+index)"
                              :checked="checks[(groupIndex+index)]"
                              @change="(id, isChecked) => {changedChecks((groupIndex+index), isChecked)}"></checkbox>
                </div>
            </template>
        </div>
        <table class="my-4">
            <tr v-for="(perkDescription, perkIndex) in sheet.perkDescriptions">
                <td :key="'perk-'+perkIndex" class="">
                    <div v-for="(perk, index) in perks[perkIndex]"
                         v-if="index < perkDescription.count"
                         class="flex items-center mr-2">
                        <checkbox
                              :key="index" group="perks"
                              :id="'perk-'+perkIndex+'-'+index"
                              :checked="perks[perkIndex][index]"
                              @change="(id, isChecked) => {changedPerks(perkIndex, index, isChecked)}"></checkbox>
                        <label class="border border-white rounded-sm px-1 mx-1 flex items-center"
                            :for="'perk-'+perkIndex+'-'+index">
                            <inline-svg class="w-3 mr-1" src="icons/book"/>
                            <span>{{ perkDescription.sections[index] }}</span>
                        </label>
                    </div>
                </td>
                <td class="ml-2 align-top flex items-start">
                    <add-links-and-icons :text="$t(perkDescription.desc)"/>
                </td>
            </tr>
        </table>

        <p v-if="perkCount < minimalPerks">
            {{ $t('You may select an additional perk!') }}
        </p>
    </div>
</template>

<script>

import CampaignSheet from "../../../models/CampaignSheet";

export default {
    props: {
        perks: Object,
        checks: Object,
        sheet: CampaignSheet
    },
    data() {
        return {}
    },
    mounted() {

    },
    computed: {
        perkCount() {
            return 0;
        },
        minimalPerks() {
            return 0;
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
