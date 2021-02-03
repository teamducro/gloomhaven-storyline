export default {
    methods: {
        calculateShop(reputation) {
            if (typeof reputation === 'undefined') {
                return 0;
            }

            let reputations = [-18, -14, -10, -6, -2, 3, 7, 11, 15, 19];
            let shop = 5;

            reputations.forEach((r) => {
                if (reputation >= r) {
                    shop--;
                }
            });

            return shop;
        },
        calculateDonationProsperity(donations) {
            let rates = [100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000];
            let donationProsperity = 0;

            rates.forEach((rate) => {
                if (donations >= rate) {
                    donationProsperity++;
                }
            });

            return donationProsperity;
        },
        prosperityBreaks() {
            return collect({
                1: 1, 5: 2, 10: 3, 16: 4, 23: 5, 31: 6, 40: 7, 51: 8, 65: 9
            });
        },
        calculateProsperity(prosperityIndex) {
            return this.prosperityBreaks()
                .filter((prosperity, index) => prosperityIndex >= index)
                .last();
        },
        calculateItems(items, prosperityIndex) {
            let filteredItems = collect(items).filter().keys().all().map(Number)
            const prosperityMap = [14, 21, 28, 35, 42, 49, 56, 63, 70];
            let prosperityItems = Array.from({length: prosperityMap[this.calculateProsperity(prosperityIndex) - 1]}, (_, i) => i + 1)
            return prosperityItems.concat(filteredItems);
        }
    }
}
