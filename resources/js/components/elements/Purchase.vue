<template>
    <div @click="purchase">
        <slot></slot>
        <toast :show="this.error" :success="false">
            {{ this.error }}
        </toast>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: null
            }
        },
        methods: {
            purchase() {
                this.$stripe.redirectToCheckout({
                    lineItems: [
                        {price: process.env.MIX_PRICE, quantity: 1},
                    ],
                    mode: 'payment',
                    successUrl: process.env.MIX_APP_URL + '/#/payment/success',
                    cancelUrl: process.env.MIX_APP_URL + '/#/payment/canceled',
                })
                    .then(function (result) {
                        this.error = result.error.message;
                    });
            }
        }
    }
</script>
