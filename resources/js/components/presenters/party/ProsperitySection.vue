<template>
    <div class="w-full mt-8">
        <div class="mb-2 flex items-center">
            <slot name="title">
                <h2>{{ $t('Gloomhaven Prosperity') }}</h2>
            </slot>
            <rollback :loading="loading" ref="rollback"
                      :value.sync="sheet.prosperityIndex"/>
        </div>
        <div class="flex flex-wrap">
            <div class="flex flex-col items-center justify-end"
                 v-for="p in max">
                <span class="font-title -mb-1" v-if="breaks.get(p)">{{ breaks.get(p) }}</span>
                <checkbox :style="!breaks.get(p) ? 'transform: scale(0.7)' : ''"
                          class="-m-1" :id="'p-'+p" group="prosperity"
                          :disabled="p===1"
                          :checked="checked[p]"
                          @change="changed"/>
            </div>
        </div>
    </div>
</template>

<script>
import Sheet from "../../../models/Sheet";
import SheetCalculations from "../../../services/SheetCalculations";
import CampaignSheet from "../../../models/CampaignSheet";

export default {
    mixins: [SheetCalculations],
    props: {
        sheet: {
            type: Sheet|CampaignSheet,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        prosperity: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            breaks: this.prosperityBreaks(this.sheet.game),
            currentProsperity: 1,
            checked: {},
        }
    },
    mounted() {
        this.updateChecked();
        this.updateProsperity();
    },
    computed: {
        max() {
            return parseInt(this.breaks.keys().last());
        }
    },
    watch: {
        "sheet.prosperityIndex": function () {
            this.updateChecked();
            this.updateProsperity();
        }
    },
    methods: {
        reset() {
            this.$refs['rollback']?.reset();
        },
        updateChecked() {
            this.checked = {};
            for (let p = 1; p <= this.sheet.prosperityIndex; p++) {
                this.checked[p] = true;
            }
        },
        changed(prosperity, isChecked) {
            let p = parseInt(prosperity.split('-')[1]);
            if (!isChecked) {
                p = p - 1;
            }
            this.sheet.prosperityIndex = p;
            this.$emit('change');
            this.updateProsperity();
        },
        updateProsperity() {
            this.$emit('update:prosperity', this.calculateProsperity(this.sheet.prosperityIndex, this.sheet.game));
        }
    }
}
</script>
