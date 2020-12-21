<template>
    <transition name="fadein">
        <alert v-if="!isEmpty || message" type="error" class="inline-block">
            <ul>
                <li v-if="message">{{ message }}</li>
                <template v-if="errors" v-for="(messages, key) in errors">
                    <li v-if="field == null || key === field"
                        v-for="error in messages">
                        {{ error }}
                    </li>
                </template>
            </ul>
        </alert>
    </transition>
</template>

<script>
import InlineSvg from "./InlineSvg";

export default {
    components: {InlineSvg},
    props: {
        response: {
            type: Object,
            default: {}
        },
        field: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            errors: {},
            message: ''
        }
    },
    computed: {
        isEmpty() {
            return typeof this.errors === 'object' && Object.keys(this.errors).length === 0
        }
    },
    watch: {
        response: function (val) {
            if (val) {
                if (val.hasOwnProperty('errors')) {
                    this.errors = val.errors;
                    this.message = null;
                } else if (val.hasOwnProperty('message')) {
                    this.errors = [];
                    this.message = val.message;
                }
            } else {
                this.errors = [];
                this.message = null;
            }
        }
    }
}
</script>
