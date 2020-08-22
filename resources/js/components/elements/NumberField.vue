<template>
    <div class="relative w-24">
        <label class="mdc-text-field mdc-text-field--outlined" ref="field">
            <input type="text" v-model="number" @change="numberChanged"
                   class="mdc-text-field__input font-title text-xl"
                   aria-labelledby="my-label-id">
            <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                    <span class="mdc-floating-label" id="my-label-id">{{ label }}</span>
                </span>
                <span class="mdc-notched-outline__trailing"></span>
            </span>
        </label>
        <div class="absolute h-full right-0 top-0 p-1">
            <div class="flex flex-col h-full">
                <div class="h-1/2 cursor-pointer" @click="add">
                    <span class="material-icons">add</span>
                </div>
                <div class="h-1/2 cursor-pointer" @click="subtract">
                    <span class="material-icons">remove</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";

export default {
    props: {
        label: {
            type: String
        },
        value: {
            type: Number,
            default: 0
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
        number: function () {
            this.validateNumber();
        }
    },
    methods: {
        add() {
            this.number++;
        },
        subtract() {
            this.number--;
        },
        numberChanged() {
            if (this.number === '-' || this.number === '') {
                this.number = 0;
            }
            this.validateNumber();
        },
        validateNumber() {
            let number = undefined;
            if (this.number !== '-' && this.number !== '') {
                this.number = parseInt(this.number);
                if (!this.number) {
                    this.number = 0;
                }
            } else {
                number = 0;
            }
            if (this.number > 20) {
                this.number = 20;
            } else if (this.number < -20) {
                this.number = -20;
            }

            this.$emit('update:value', number ?? this.number);
        }
    }
}
</script>
