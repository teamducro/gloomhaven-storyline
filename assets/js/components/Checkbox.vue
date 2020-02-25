<template>
    <div class="mdc-form-field flex items-center" ref="form-field">
        <div class="mdc-checkbox" ref="checkbox">
            <input type="checkbox"
                   class="mdc-checkbox__native-control"
                   :name="group"
                   v-model="isChecked"
                   :disabled="disabled"
                   :id="id"
                   @change="changed"/>
            <div class="mdc-checkbox__background">
                <svg class="mdc-checkbox__checkmark"
                     viewBox="0 0 24 24">
                    <path class="mdc-checkbox__checkmark-path"
                          fill="none"
                          d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                </svg>
                <div class="mdc-checkbox__mixedmark"></div>
            </div>
            <div class="mdc-checkbox__ripple"></div>
        </div>
        <label :for="id" :class="{'text-white2-25': disabled}">{{ label }}</label>
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
                this.$emit('changed', this.id, this.isChecked);
            }
        }
    }
</script>
