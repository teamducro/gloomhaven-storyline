<template>
    <transition name="fade">
        <ul v-if="errors || message" class="text-required">
            <li v-if="message">{{ message }}</li>
            <template v-if="errors" v-for="(messages, key) in errors">
                <li v-if="field == null || key === field" v-for="error in messages">
                    {{ error }}
                </li>
            </template>
        </ul>
    </transition>
</template>

<script>
    export default {
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
