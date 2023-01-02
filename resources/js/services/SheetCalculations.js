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
        prosperityBreaks(game) {
            switch (game) {
                case 'cs':
                    return collect({
                        1: 1, 4: 2, 9: 3, 15: 4, 22: 5, 30: 6, 39: 7, 50: 8, 60: 9
                    });
                default:
                    return collect({
                        1: 1, 5: 2, 10: 3, 16: 4, 23: 5, 31: 6, 40: 7, 51: 8, 65: 9
                    });
            }
        },
        calculateProsperity(prosperityIndex, game) {
            return this.prosperityBreaks(game)
                .filter((prosperity, index) => prosperityIndex >= index)
                .last();
        },
        unlockedItems(items, game = 'gh') {
            let filteredItems = collect(items).filter().keys().all().map(Number)
            return this.prependGame(game, filteredItems);
        },
        // CS uses the GH "base" items and adds a few more
        calculateItemsGh(unlockedItems, prosperityIndex) {
            const prosperityMap = [14, 21, 28, 35, 42, 49, 56, 63, 70];
            let prosperityItems = Helpers.makeArrayWithNumbers(prosperityMap[this.calculateProsperity(prosperityIndex) - 1])
            prosperityItems = this.prependGame('gh', prosperityItems);

            return _.uniq(prosperityItems.concat(unlockedItems));
        },
        calculateItemsJotl(unlockedItems, scenarioRepository) {
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

            shopItems = this.prependGame('jotl', shopItems);

            return _.uniq(shopItems.concat(unlockedItems));
        },
        prependGame(game, items) {
            return items.map(id => game + '-' + id);
        }
    }
}
