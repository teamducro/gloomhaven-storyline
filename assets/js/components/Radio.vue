<template>
    <div class="mdc-form-field">
        <div class="mdc-radio">
            <input class="mdc-radio__native-control"
                   type="radio"
                   :id="id"
                   :name="group"
                   :checked="isChecked"
                   @change="changed">
            <div class="mdc-radio__background">
                <div class="mdc-radio__outer-circle"></div>
                <div class="mdc-radio__inner-circle"></div>
            </div>
            <div class="mdc-radio__ripple"></div>
        </div>
        <label :for="id">{{ label }}</label>
    </div>
</template>

<script>
    export default {
        props: ['id', 'group', 'label', 'checked'],
        data() {
            return {
                'isChecked': false
            }
        },
        mounted() {
            this.isChecked = this.checked || false;
        },
        methods: {
            changed() {
                this.$emit('update:checked', this.isChecked);
                this.$emit('changed', this.id);
            }
        }
    }
</script>
