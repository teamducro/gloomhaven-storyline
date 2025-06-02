import Helpers from "./Helpers";

export default {
    methods: {
        calculateDefense(morale) {
            if (!morale) return 0;
            if (morale <= 2) return -10;
            if (morale <= 4) return -5;
            if (morale <= 7) return 0;
            if (morale <= 10) return 5;
            if (morale <= 13) return 10;
            if (morale <= 20) return 15;
            return 0;
        },
        calculateCostModifier(reputation) {
            if (!reputation) {
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
                case 'fh':
                    return collect({
                        1: 1, 7: 2, 16: 3, 28: 4, 43: 5, 61: 6, 82: 7, 106: 8, 133: 9
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
        calculateItemsFh(unlockedItems, buildingRepository) {
            // Initially available items
            let availableItems = Helpers.makeArrayWithNumbers(10).concat(Helpers.makeArrayWithNumbers(9, 120));

            // Items available through building upgrades
            let itemRewards = {
                // Craftsman
                34: {
                    1: Helpers.makeArrayWithNumbers(10, 1), // 1 - 10
                    2: Helpers.makeArrayWithNumbers(5, 11), // 10 - 15
                    3: Helpers.makeArrayWithNumbers(5, 16), // 15 - 20
                    4: Helpers.makeArrayWithNumbers(5, 21), // 20 - 25
                    5: Helpers.makeArrayWithNumbers(5, 26), // 25 - 30
                    6: Helpers.makeArrayWithNumbers(5, 31), // 30 - 35
                    7: Helpers.makeArrayWithNumbers(5, 36), // 35 - 40
                    8: Helpers.makeArrayWithNumbers(5, 41), // 40 - 45
                    9: Helpers.makeArrayWithNumbers(5, 46), // 45 - 50
                },
                // Trading Post
                37: {
                    1: Helpers.makeArrayWithNumbers(9, 120), // 120 - 128
                    2: Helpers.makeArrayWithNumbers(9, 129), // 129 - 137
                    3: Helpers.makeArrayWithNumbers(9, 138), // 138 - 146
                    4: Helpers.makeArrayWithNumbers(9, 147), // 147 - 155
                },
                // Jeweler
                39: {
                    1: Helpers.makeArrayWithNumbers(4, 156), // 156 - 159
                    2: Helpers.makeArrayWithNumbers(4, 160), // 160 - 163
                    3: Helpers.makeArrayWithNumbers(4, 164), // 164 - 167
                },
                // Stables
                88: {
                    1: [247],
                },
            };

            for (let [buldingId, levelUnlocks] of Object.entries(itemRewards)) {
                for (let [minLevel, itemUnlocks] of Object.entries(levelUnlocks)) {
                    if (buildingRepository.find(buldingId)?.level >= minLevel) {
                        availableItems.push(...itemUnlocks);
                    }
                }
            }

            // The rest are available through scenario/treasure/event rewards,
            // and are listed as `itemDesigns` in CampaignSheet.js,
            // to be toggled manually and passed to this function from Items.vue as `unlockedItems`.

            availableItems = this.prependGame('fh', availableItems);

            // Sorted because FH is the only game where the unlockedItems aren't strictly at the end.
            // .slice(3) is because the unlockedItems are passed with 'fh-' prepended.
            return _.uniq(availableItems.concat(unlockedItems).sort((a, b) => +a.slice(3) - b.slice(3)));
        },
        calculateCrossGhItems(buildingRepository) {
            // Initially available items
            let availableItems = [10, 25, 72, 105, 109, 116];

            // Items available through building upgrades
            let itemRewards = {
                // Trading Post
                37: {
                    2: [21, 37, 53, 93, 94, 106, 115],
                    3: [46, 83, 84, 85, 86, 87, 88, 102, 110, 111, 120, 121, 122, 123, 126, 128],
                    4: [17, 35, 47, 51, 62, 74, 77, 78, 79, 80, 81, 82, 117, 118, 119, 127, 129, 131]
                },
                // Enhancer
                44: {
                    1: [153, 159, 161],
                    4: [154, 155, 157, 163]
                }
            };

            for (let [buldingId, levelUnlocks] of Object.entries(itemRewards)) {
                for (let [minLevel, itemUnlocks] of Object.entries(levelUnlocks)) {
                    if (buildingRepository.find(buldingId)?.level >= minLevel) {
                        availableItems.push(...itemUnlocks);
                    }
                }
            }

            return availableItems.sort();
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
        },
        calculateRecommendedLevel(characters) {
            const count = Object.keys(characters).length || 0;
            const total = collect(Object.values(characters)).sum('level') || 0;

            // No party
            if (count === 0) {
                return 1;
            }

            // Solo party
            if (count === 1) {
                return total >= 5
                    ? Math.ceil(total / 2)
                    : 1;
            }

            // Party of x
            return Math.ceil(total / count / 2);
        },
        calculateDifficulty(level, recommendedLevel) {
            const difference = level - recommendedLevel;
            const difficulties = {
                '-4': this.$t('Very Easy'),
                '-3': this.$t('Very Easy'),
                '-2': this.$t('Very Easy'),
                '-1': this.$t('Easy'),
                '0': this.$t('Normal'),
                '1': this.$t('Hard'),
                '2': this.$t('Very Hard'),
                '3': this.$t('Very Hard'),
                '4': this.$t('Very Hard'),
            }

            return difficulties[difference] || 'Normal';
        },
        calculateDifficultyTable(level, game)
        {
            let rows = {
                monsterLevel: {
                    label: this.$t('Monster Level'),
                    value: level,
                },
                goldConversion: {
                    label: this.$t('Gold conversion'),
                    value: [2,2,3,3,4,4,5,6][level] || 2,
                },
                trapDamage: {
                    label: this.$t('Trap damage'),
                    value: level + 2
                }
            }

            if (game === 'fh') {
                rows.hazardousTerrain = {
                    label: this.$t('Hazardous terrain'),
                    value: [1,2,2,2,3,3,3,4][level] || 2
                }
            }

            rows.bonusExperience = {
                label: this.$t('Bonus experience'),
                    value: (level * 2) + 4,
            };

            return rows;
        }
    }
}
