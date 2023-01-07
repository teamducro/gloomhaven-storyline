<template>
    <div class="mdc-checkbox" ref="checkbox">
        <input type="checkbox"
               class="mdc-checkbox__native-control"
               :name="group"
               v-model="isChecked"
               :disabled="isDisabled"
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
</template>

<script>
export default {
    inject: ['appData'],
    props: {
        id: {
            type: String,
            default: undefined
        },
        group: {
            type: String,
            default: undefined
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
            return this.disabled || (this.autoDisable && this.appData.read_only);
        }
    },
    watch: {
        checked: function (isChecked) {
            this.isChecked = isChecked;
        }
    },
    methods: {
        changed() {
            this.$emit('update:checked', this.isChecked);
            this.$emit('change', this.id, this.isChecked);
        }
    }
}
</script>
