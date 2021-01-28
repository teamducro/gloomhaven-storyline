export default {
    methods: {
        calculateShop(reputation) {
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
        calculateItems(items, prosperity) {
            const prosperityItems = [14, 21, 28, 35, 42, 49, 56, 63, 70];
            console.log(items);
            return items;
        }
    }
}
