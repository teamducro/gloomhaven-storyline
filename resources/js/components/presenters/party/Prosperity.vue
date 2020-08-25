<template>
    <div class="flex flex-wrap -mx-2">
        <div class="flex flex-col items-center justify-end"
             v-for="(p,index) in 65">
            <span class="font-title -mb-1" v-if="breaks[p]">{{ breaks[p] }}</span>
            <checkbox :style="!breaks[p] ? 'transform: scale(0.7)' : ''"
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
        prosperity: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            breaks: {
                1: 1,
                5: 2,
                10: 3,
                16: 4,
                23: 5,
                31: 6,
                40: 7,
                51: 8,
                65: 9
            },
            currentProsperity: 1,
            checked: {}
        }
    },
    mounted() {
        this.currentProsperity = this.prosperity;
        this.updateChecked();
    },
    watch: {
        prosperity: function (currentProsperity) {
            this.currentProsperity = currentProsperity;
            this.updateChecked();
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
            this.$emit('update:prosperity', this.currentProsperity);
            this.$emit('change', this.currentProsperity);
        }
    }
}
</script>
