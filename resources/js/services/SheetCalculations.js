import Helpers from "./Helpers";

export default {
    methods: {
        calculateCostModifier(reputation) {
            if (typeof reputation === 'undefined') {
                return 0;
            }

            let reputations = [-18, -14, -10, -6, -2, 3, 7, 11, 15, 19];
            let costModifier = 5;

            reputations.forEach((r) => {
                if (reputation >= r) {
                    costModifier--;
                }
            });

            return costModifier;
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
        calculateItemsGh(items, prosperityIndex) {
            let filteredItems = collect(items).filter().keys().all().map(Number)
            const prosperityMap = [14, 21, 28, 35, 42, 49, 56, 63, 70];
            let prosperityItems = Helpers.makeArrayWithNumbers(prosperityMap[this.calculateProsperity(prosperityIndex) - 1])
            return _.uniq(prosperityItems.concat(filteredItems));
        },
        calculateItemsJotl(items, scenarioRepository) {
            let filteredItems = collect(items).filter().keys().all().map(Number)
            let shopItems = [];

            let itemRewards = {
                2: Helpers.makeArrayWithNumbers(13),
                4: [14],
                9: Helpers.makeArrayWithNumbers(6, 15),
                15: Helpers.makeArrayWithNumbers(6, 21)
            }

            for (const scenarioId in itemRewards) {
                if (scenarioRepository.find(scenarioId).isComplete()) {
                    shopItems.push(...itemRewards[scenarioId]);
                }
            }

            return _.uniq(shopItems.concat(filteredItems));
        }
    }
}
