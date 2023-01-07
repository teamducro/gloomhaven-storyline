<template>
    <div class="mdc-form-field flex items-center">
        <div class="mdc-radio">
            <input class="mdc-radio__native-control"
                   type="radio"
                   :id="Number.isInteger(id) ? group+id : id"
                   :name="group"
                   :checked="isChecked"
                   :disabled="isDisabled"
                   @change="changed">
            <div class="mdc-radio__background">
                <div class="mdc-radio__outer-circle"></div>
                <div class="mdc-radio__inner-circle"></div>
            </div>
            <div class="mdc-radio__ripple"></div>
        </div>
        <label :for="id" :class="{'text-white2-25': disabled}">{{ label }}</label>
    </div>
</template>

<script>
export default {
    inject: ['appData'],
    props: {
        id: {
            type: [String, Number]
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
        },
        autoDisable: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            'isChecked': false
        }
    },
    mounted() {
        this.isChecked = this.checked;
    },
    computed: {
        isDisabled() {
            return this.disabled || (this.autoDisable && this.appData.story?.read_only);
        }
    },
    methods: {
        changed() {
            this.$emit('update:checked', this.isChecked);
            this.$emit('changed', this.id);
        }
    }
}
</script>
