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
export default {
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
            breaks: collect({
                1: 1,
                5: 2,
                10: 3,
                16: 4,
                23: 5,
                31: 6,
                40: 7,
                51: 8,
                65: 9
            }),
            currentProsperity: 1,
            checked: {}
        }
    },
    mounted() {
        this.currentProsperity = this.prosperityIndex;
        this.updateChecked();
        this.calculateProsperity();
    },
    watch: {
        prosperityIndex: function (currentProsperity) {
            this.currentProsperity = currentProsperity;
            this.updateChecked();
            this.calculateProsperity();
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
            this.calculateProsperity();
        },
        calculateProsperity() {
            let prosperity = this.breaks
                .filter((prosperity, index) => this.currentProsperity >= index)
                .last();
            this.$emit('update:prosperity', prosperity);
        }
    }
}
</script>
