<template>
    <div class="text-field-container">
        <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="field">
            <span class="mdc-text-field__ripple"></span>
            <input class="mdc-text-field__input" :aria-labelledby="id" :disabled="isDisabled"
                   type="text" :name="id" :value="text" @change="textChanged">
            <span class="mdc-floating-label" :id="id"
                  :class="{'mdc-floating-label--float-above': text.length}">{{ label }}</span>
            <span class="mdc-line-ripple"></span>
        </label>
    </div>
</template>

<script>
import {MDCTextField} from "@material/textfield/component";

export default {
    inject: ['appData'],
    props: {
        id: {
            type: String
        },
        label: {
            type: String,
            default: null
        },
        value: {
            type: String,
            default: 0
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
        },
    },
    data() {
        return {
            text: '',
            field: null
        }
    },
    mounted() {
        this.text = this.value;
        this.field = new MDCTextField(this.$refs['field']);
    },
    computed: {
        isDisabled() {
            return this.disabled || (this.autoDisable && this.appData.story?.read_only);
        }
    },
    watch: {
        value: function (value) {
            this.text = value;
        },
        text: function () {
            this.validateText();
        }
    },
    methods: {
        textChanged(e) {
            this.text = e.target.value;
            this.validateText();
        },
        validateText() {
            if (this.text && this.max && this.text.length > this.max) {
                this.text = this.text.substr(0, this.max);
            }

            if (this.text !== this.value) {
                this.$emit('update:value', this.text);
                this.$emit('change', this.text);
            }
        },
        refresh() {
            if (this.field) {
                this.field.destroy();
            }
            this.field = new MDCTextField(this.$refs['field']);
        }
    }
}
</script>

<style scoped lang="scss">
</style>
