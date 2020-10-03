<template>
    <div class="mdc-form-field flex items-center" ref="form-field">
        <checkbox
            :id="id"
            :group="group"
            :checked="isChecked"
            :disabled="disabled"
            @change="changed"></checkbox>
        <label :for="id" :class="{'text-white2-25': disabled}">{{ label }}</label>
    </div>
</template>

<script>
import Checkbox from "./Checkbox";

export default {
    components: {Checkbox},
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
    watch: {
        checked: function (isChecked) {
            this.isChecked = isChecked;
        }
    },
    methods: {
        changed(id, checked) {
            this.isChecked = checked;
            this.$emit('update:checked', checked);
            this.$emit('change', id, checked);
        }
    }
}
</script>
