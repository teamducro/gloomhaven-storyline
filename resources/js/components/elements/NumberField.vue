<template>
    <div class="relative w-24">
        <label class="mdc-text-field mdc-text-field--outlined" ref="field">
            <input type="text" :value="number" @change="numberChanged" :aria-labelledby="id"
                   class="mdc-text-field__input font-title text-xl">
            <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                    <span v-if="label" class="mdc-floating-label" :id="id">{{ label }}</span>
                </span>
                <span class="mdc-notched-outline__trailing"></span>
            </span>
        </label>
        <div class="absolute h-full right-0 top-0 p-1">
            <div class="flex flex-col h-full">
                <button class="h-1/2 no-select" @click="add" :class="{'text-gray-500': number === max}">
                    <span class="material-icons">add</span>
                </button>
                <button class="h-1/2 no-select" @click="subtract" :class="{'text-gray-500': number === min}">
                    <span class="material-icons">remove</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";

export default {
    props: {
        id: {
            type: String
        },
        label: {
            type: String,
            default: null
        },
        value: {
            type: Number,
            default: 0
        },
        step: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            number: 0,
            field: null
        }
    },
    mounted() {
        this.number = this.value;
        this.field = new MDCTextField(this.$refs['field']);
    },
    watch: {
        value: function (value) {
            this.number = value;
        },
        number: function () {
            this.validateNumber();
        }
    },
    methods: {
        add() {
            this.number = this.number + this.step;
        },
        subtract() {
            this.number = this.number - this.step;
        },
        numberChanged(e) {
            this.number = e.target.value;
            if (this.number === '-' || this.number === '') {
                this.number = 0;
            }
            this.validateNumber();
        },
        validateNumber() {
            if (this.number !== '-' && this.number !== '') {
                this.number = parseInt(this.number);
                if (!this.number) {
                    this.number = 0;
                }
            }

            if (this.step > 1) {
                this.number = Math.ceil(this.number / this.step) * this.step;
            }

            if (this.max !== null && this.number > this.max) {
                this.number = this.max;
            } else if (this.min !== null && this.number < this.min) {
                this.number = this.min;
            }

            if (Number.isInteger(this.number)) {
                this.$emit('update:value', this.number);
                this.$emit('change', this.number);
            }
        }
    }
}
</script>
