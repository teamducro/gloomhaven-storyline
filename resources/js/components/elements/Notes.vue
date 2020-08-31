<template>
    <div class="mdc-text-field mdc-text-field--textarea w-full"
         :ref="id">
        <textarea :id="id" @change="changed" v-model="text" :disabled="disabled"
                  class="mdc-text-field__input" rows="4" cols="40"></textarea>
        <div class="mdc-notched-outline">
            <div class="mdc-notched-outline__leading"></div>
            <div class="mdc-notched-outline__notch">
                <label :for="id" class="mdc-floating-label">{{ label }}</label>
            </div>
            <div class="mdc-notched-outline__trailing"></div>
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
            type: String
        },
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            text: '',
            field: null
        }
    },
    mounted() {
        this.field = new MDCTextField(this.$refs[this.id]);
        this.text = this.value;
    },
    watch: {
        value: function (value) {
            this.text = value;
        }
    },
    methods: {
        changed() {
            this.$emit('update:value', this.text);
            this.$emit('change', this.text);
        }
    }
}
</script>

<style lang="scss">
.mdc-notched-outline__notch {
    border-right: none;
    border-left: none;
}
</style>

