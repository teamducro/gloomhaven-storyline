<template>
    <div class="flex flex-wrap">
        <div class="flex flex-col items-center justify-end"
             v-for="p in 65">
            <span class="font-title -mb-1" v-if="breaks.get(p)">{{ breaks.get(p) }}</span>
            <checkbox :style="!breaks.get(p) ? 'transform: scale(0.7)' : ''"
                      class="-m-1"
                      :id="'p-'+p"
                      group="prosperity"
                      :disabled="p===1"
                      :checked="checked[p]"
                      @change="changed"></checkbox>
        </div>
    </div>
</template>

<script>
import SheetCalculations from "../../../services/SheetCalculations";

export default {
    mixins: [SheetCalculations],
    props: {
        prosperityIndex: {
            type: Number,
            default: 1
        },
        prosperity: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            breaks: this.prosperityBreaks(),
            currentProsperity: 1,
            checked: {}
        }
    },
    mounted() {
        this.currentProsperity = this.prosperityIndex;
        this.updateChecked();
        this.updateProsperity();
    },
    watch: {
        prosperityIndex: function (currentProsperity) {
            this.currentProsperity = currentProsperity;
            this.updateChecked();
            this.updateProsperity();
        }
    },
    methods: {
        updateChecked() {
            this.checked = {};
            for (let p = 1; p <= this.currentProsperity; p++) {
                this.checked[p] = true;
            }
        },
        changed(prosperity, isChecked) {
            let p = parseInt(prosperity.split('-')[1]);
            if (!isChecked) {
                p = p - 1;
            }
            this.currentProsperity = p;
            this.$emit('update:prosperityIndex', this.currentProsperity);
            this.$emit('change', this.currentProsperity);
            this.updateProsperity();
        },
        updateProsperity() {
            this.$emit('update:prosperity', this.calculateProsperity(this.currentProsperity));
        }
    }
}
</script>
