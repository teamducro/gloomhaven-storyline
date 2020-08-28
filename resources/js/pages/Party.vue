<template>
    <div class="pt-12 pb-4 px-4">
        <div id="info" class="bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <h1 class="mb-4 text-xl">{{ $t('Party sheet') }}</h1>

            <div class="flex w-full">
                <div class="flex-1">
                    <div class="mb-2 flex items-center">
                        <h3>{{ $t('Reputation') }}</h3>
                        <rollback :value.sync="reputation"></rollback>
                    </div>
                    <number-field :value.sync="reputation" :min="-20" :max="20" :id="'reputation'"></number-field>
                </div>
                <div class="flex-1">
                    <h3 class="mb-2">{{ $t('Shop modifier') }}</h3>
                    <span class="font-title text-xl">{{ shop }}</span>
                </div>
            </div>

            <div class="flex w-full mt-8">
                <div class="flex-1">
                    <div class="mb-2 flex items-center">
                        <h3>{{ $t('Sanctuary of the Great Oak') }}</h3>
                        <rollback :value.sync="donations"></rollback>
                    </div>
                    <number-field :value.sync="donations" :min="0" :step="10" :id="'reputation'"></number-field>
                    <p class="text-sm">
                        When in town, a character may donate 10g to the Sanctuary to add 2 Bless cards to their combat
                        deck. For each such donation, increase the counter. When 100 gold is donated, open envelope
                        <span class="font-title">B</span>
                    </p>
                </div>
                <div class="flex-1">
                    <p v-if="donationProsperity">
                        <span class="font-title">{{ donationProsperity }}</span> gained prosperity by donations.
                    </p>
                </div>
            </div>

            <div class="w-full mt-8">
                <div class="mb-2 flex items-center">
                    <h3>{{ $t('Gloomhaven Prosperity') }}</h3>
                    <rollback :value.sync="prosperity"></rollback>
                </div>
                <prosperity :prosperity.sync="prosperity"></prosperity>
            </div>
        </div>
    </div>
</template>

<script>
import Rollback from "../components/elements/Rollback";

export default {
    components: {Rollback},
    data() {
        return {
            reputation: 0,
            shop: 0,
            donations: 0,
            donationProsperity: 0,
            prosperity: 1,
        }
    },
    watch: {
        reputation: function () {
            this.calculateShop();
        },
        donations: function () {
            this.calculateDonationProsperity();
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
        },
        calculateDonationProsperity() {
            let rates = collect([100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000]);
            let donationProsperity = 0;
            rates.each((rate) => {
                if (this.donations >= rate) {
                    donationProsperity++;
                }
            });
            this.donationProsperity = donationProsperity;
        }
    }
}
</script>
