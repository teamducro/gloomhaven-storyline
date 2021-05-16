<template>
    <div @click.stop="purchase">
        <slot></slot>
    </div>
</template>

<script>
import Helpers from "../../services/Helpers";
import CheckoutRepository from "../../apiRepositories/CheckoutRepository";

export default {
    props: {
        storyId: {
            type: Number
        }
    },
    data() {
        return {
            checkout: new CheckoutRepository
        }
    },
    methods: {
        async purchase() {
            const response = await this.checkout.checkout(this.storyId)
                .catch(e => {
                    this.error(e.response.data.message);
                });

            if (response) {
                this.$stripe.redirectToCheckout({
                    sessionId: response.data.session
                })
                    .then(function (result) {
                        this.error(result.error.message);
                    });
            }
        },
        error(message) {
            this.$bus.$emit('toast', message, false);
        }
    }
}
</script>
