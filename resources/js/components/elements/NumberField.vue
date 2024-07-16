<template>
    <div class="number-field-container">
        <label class="mdc-text-field mdc-text-field--outlined" ref="field">
            <input type="text" :value="number" @change="numberChanged" :aria-labelledby="id"
                   class="mdc-text-field__input font-title text-xl" :disabled="isDisabled"
                   pattern="[0-9]*" inputmode="numeric" novalidate>
            <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                    <span v-if="label" class="mdc-floating-label" :id="id">{{ label }}</span>
                </span>
                <span class="mdc-notched-outline__trailing"></span>
            </span>
        </label>
        <div class="absolute h-full right-0 top-0 p-1" :class="{'text-gray-400': isDisabled}">
            <div class="flex flex-col h-full">
                <button class="h-1/2 no-select" @click="add" :class="{'text-gray-400': number === max}">
                    <span class="material-icons">add</span>
                </button>
                <button class="h-1/2 no-select" @click="subtract" :class="{'text-gray-400': number === min}">
                    <span class="material-icons">remove</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";
import Helpers from "../../services/Helpers";

export default {
    inject: ['appData'],
    props: {
        id: {
            type: String,
            required: true
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
        },
        disabled: {
            type: Boolean,
            default: false
        },
        autoDisable: {
            type: Boolean,
            default: true
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
    computed: {
        isDisabled() {
            return this.disabled || (this.autoDisable && this.appData.read_only);
        },
        isFloat() {
            return Helpers.isFloat(this.step);
        }
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
            if (this.isDisabled) {
                return;
            }

            this.number = this.number + this.step;
        },
        subtract() {
            if (this.isDisabled) {
                return;
            }

            this.number = this.number - this.step;
        },
        numberChanged(e) {
            if (this.isDisabled) {
                return;
            }

            this.number = e.target.value;
            if (this.number === '-' || this.number === '') {
                this.number = 0;
            }
            this.validateNumber();
        },
        validateNumber() {
            if (this.number !== '-' && this.number !== '') {
                if (this.isFloat) {
                    this.number = parseFloat(String(this.number).replace(',', '.'));
                } else {
                    this.number = parseInt(this.number);
                }
                if (!this.number) {
                    this.number = 0;
                }
            }

            if (this.step > 1) {
                this.number = Math.ceil(this.number / this.step) * this.step;
            } else if (this.step < 1) {
                this.number = Number(this.number.toFixed(1));
            }

            if (this.max !== null && this.number > this.max) {
                this.number = this.max;
            } else if (this.min !== null && this.number < this.min) {
                this.number = this.min;
            }

            if (Helpers.isNumeric(this.number)) {
                this.$emit('update:value', this.number);
                this.$emit('change', this.number);
            }
        }
    }
}
</script>

<style scoped lang="scss">
.number-field-container {
    @apply relative;

    &:not([class*='w-']) {
        @apply w-20;
    }
}
</style>
