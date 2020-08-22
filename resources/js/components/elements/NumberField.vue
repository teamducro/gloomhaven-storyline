<template>
    <div class="flex items-center">
        <div class="relative w-24">
            <label class="mdc-text-field mdc-text-field--outlined" ref="field">
                <input type="text" v-model="number" @change="numberChanged" :aria-labelledby="id"
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
                    <div class="h-1/2 cursor-pointer" @click="add">
                        <span class="material-icons">add</span>
                    </div>
                    <div class="h-1/2 cursor-pointer" @click="subtract">
                        <span class="material-icons">remove</span>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <span v-if="this.stack.length > 1" @click="rollback"
                  class="material-icons cursor-pointer ml-4">replay</span>
        </transition>
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
        }
    },
    data() {
        return {
            number: 0,
            field: null,
            stack: []
        }
    },
    mounted() {
        this.number = this.value;
        this.stack.push(this.number);
        this.field = new MDCTextField(this.$refs['field']);
    },
    watch: {
        number: function () {
            this.validateNumber();
        }
    },
    methods: {
        rollback() {
            if (this.stack.length > 1) {
                this.stack.pop();
                this.number = _.last(this.stack);
                this.updateNumber();
            }
        },
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
            if (this.number !== '-' && this.number !== '') {
                this.number = parseInt(this.number);
                if (!this.number) {
                    this.number = 0;
                }
            }
            if (this.number > 20) {
                this.number = 20;
            } else if (this.number < -20) {
                this.number = -20;
            }

            if (Number.isInteger(this.number) && (!this.stack.length || _.last(this.stack) !== this.number)) {
                this.stack.push(this.number);
                this.updateNumber();
            }
        },
        updateNumber() {
            this.$emit('update:value', this.number);
        }
    }
}
</script>
