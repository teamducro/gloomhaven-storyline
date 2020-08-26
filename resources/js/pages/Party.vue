<template>
    <div class="pt-12 pb-4 px-4">
        <div id="info" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">
            <h1 class="mb-4 text-xl">{{ $t('Party sheet') }}</h1>

            <div class="flex w-full">
                <div class="flex-1">
                    <h3 class="mb-2">{{ $t('Reputation') }}</h3>
                    <number-field :value.sync="reputation" :id="'reputation'"></number-field>
                </div>
                <div class="flex-1">
                    <h3 class="mb-2">{{ $t('Shop modifier') }}</h3>
                    <span class="font-title text-xl">{{ shop }}</span>
                </div>
            </div>

            <div class="w-full mt-8">
                <h3 class="mb-2">{{ $t('Sanctuary Donations') }}</h3>
            </div>

            <div class="w-full mt-8">
                <h3 class="mb-2">{{ $t('Prosperity') }}</h3>
                <prosperity :prosperity.sync="prosperity"></prosperity>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            reputation: 0,
            shop: 0,
            prosperity: 1,
        }
    },
    watch: {
        reputation: function () {
            this.calculateShop();
        }
    },
    mounted() {
        this.calculateShop();
    },
    methods: {
        calculateShop() {
            if (this.reputation < -18) {
                this.shop = 5;
            } else if (this.reputation < -14) {
                this.shop = 4;
            } else if (this.reputation < -10) {
                this.shop = 3;
            } else if (this.reputation < -6) {
                this.shop = 2;
            } else if (this.reputation < -2) {
                this.shop = 1;
            } else if (this.reputation < 3) {
                this.shop = 0;
            } else if (this.reputation < 7) {
                this.shop = -1;
            } else if (this.reputation < 11) {
                this.shop = -2;
            } else if (this.reputation < 15) {
                this.shop = -3;
            } else if (this.reputation < 19) {
                this.shop = -4;
            } else {
                this.shop = -5;
            }
        }
    }
}
</script>
