<template>
    <div class="mdc-form-field flex items-center">
        <div class="mdc-radio">
            <input class="mdc-radio__native-control"
                   type="radio"
                   :id="id"
                   :name="group"
                   :checked="isChecked"
                   :disabled="disabled"
                   @change="changed">
            <div class="mdc-radio__background">
                <div class="mdc-radio__outer-circle"></div>
                <div class="mdc-radio__inner-circle"></div>
            </div>
            <div class="mdc-radio__ripple"></div>
        </div>
        <label :for="id" :class="{'text-gray-600': disabled}">{{ label }}</label>
    </div>
</template>

<script>
    export default {
        props: {
            id: {
                type: String
            },
            group: {
                type: String
            },
            label: {
                type: String
            },
            checked: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                'isChecked': false
            }
        },
        mounted() {
            this.isChecked = this.checked;
        },
        methods: {
            changed() {
                this.$emit('update:checked', this.isChecked);
                this.$emit('changed', this.id);
            }
        }
    }
</script>
