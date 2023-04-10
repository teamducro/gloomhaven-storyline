<template>
    <div class="">
        <div class="mb-2 flex items-center">
            <slot name="title">
                <add-links-and-icons class="text-white flex items-center gap-2" tag="h2" :text="title"/>
            </slot>
            <rollback :loading="loading" ref="rollback"
                      :value.sync="currentValue"/>
        </div>
        <number-field :value.sync="currentValue" :step="step" :min="min" :max="max" :id="slugify(title)"/>
    </div>
</template>

<script>
import Slugify from "../../../services/Slugify";

export default {
    mixins: [Slugify],
    props: {
        title: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        },
        step: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 999
        }
    },
    data() {
        return {
            currentValue: this.value
        }
    },
    watch: {
        value: function (value) {
            this.currentValue = value;
        },
        currentValue: function (value, oldValue) {
            if (value === oldValue)
                return;

            // Update the parent component's value
            this.$emit('update:value', value);
            this.$emit('change', value);
        }
    },
    methods: {
        reset() {
            this.$refs['rollback']?.reset();
        }
    }
}
</script>
