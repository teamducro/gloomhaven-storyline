<template>
    <div>
        <div class="text-center md:text-left">
            <h2 class="text-xl mt-8">{{ $t('Already purchased a licence?') }}</h2>
            <p class="leading-loose">
                {{ $t('Fill in your email, you\'ll receive a link to sync your campaign.') }}
            </p>
        </div>
        <form @submit="requestLoginLink" class="flex flex-col md:flex-row items-center">
            <label class="mdc-text-field mdc-text-field--filled" ref="email">
                <span class="mdc-text-field__ripple"></span>
                <input class="mdc-text-field__input" aria-labelledby="email-label"
                       v-model="email" type="text" name="email">
                <span class="mdc-floating-label" id="email-label">Email</span>
                <span class="mdc-line-ripple"></span>
            </label>
            <button type="submit" class="mdc-button mdc-button--raised mt-2 ml-0 md:mt-0 md:ml-2">
                <span class="mdc-button__label">{{ $t('Sync Campaign') }}</span>
            </button>
        </form>
        <validation-errors :response="errors" field="email"/>
        <transition name="fade">
            <span v-if="success" class="text-complete">
                {{ $t('The email is send to your inbox.') }}
            </span>
        </transition>
    </div>
</template>

<script>
    import {MDCTextField} from "@material/textfield/component";
    import Csrf from "../../../services/Csrf";

    export default {
        data() {
            return {
                email: null,
                emailField: null,
                errors: null,
                success: false
            }
        },
        mounted() {
            this.emailField = new MDCTextField(this.$refs['email']);
        },
        destroyed() {
            if (this.emailField) {
                this.emailField.destroy();
            }
        },
        methods: {
            requestLoginLink(e) {
                e.preventDefault();
                this.errors = null;
                (new Csrf).init().then(() => {
                    axios.post('mail-login-link', {
                        'email': this.email
                    }).then(response => {
                        this.email = null;
                        this.success = true;
                        setTimeout(() => {
                            this.success = false;
                        }, 5000);
                    }).catch(e => {
                        this.errors = e.response.data;
                    });
                });
            }
        }
    }
</script>
