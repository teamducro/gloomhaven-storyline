import Helpers from "./Helpers";
import GameData from "./GameData";

const gameData = new GameData();

// Item entries are numbers or [from, to] ranges.
const expandItems = (entries = []) => entries.flatMap(entry => Array.isArray(entry)
    ? Helpers.makeArrayWithNumbers(entry[1] - entry[0] + 1, entry[0])
    : [entry]);

// Items unlocked by building level, `buildings`: building id => level => entries.
const buildingItems = (buildings, buildingRepository) => Object.entries(buildings).flatMap(([buildingId, levelUnlocks]) => {
    return Object.entries(levelUnlocks)
        .filter(([minLevel]) => buildingRepository.find(buildingId)?.level >= minLevel)
        .flatMap(([, entries]) => expandItems(entries));
});

export default {
    methods: {
        calculateDefense(morale) {
            if (!morale) return 0;

            const [, defense] = gameData.campaignRule('fh', 'moraleDefense').find(([maxMorale]) => morale <= maxMorale) || [];
            return defense ?? 0;
        },
        calculateCostModifier(reputation, game) {
            const prices = gameData.campaignRule(game, 'reputationPrices');
            if (!reputation || !prices.length) {
                return 0;
            }

            return 5 - prices.filter(price => reputation >= price).length;
        },
        calculateDonationProsperity(donations, game = 'gh') {
            const greatOak = gameData.campaignRule(game, 'greatOak');
            if (greatOak) {
                return Math.min(greatOak.maxProsperity, Math.floor(donations / greatOak.goldPerProsperity));
            }

            return gameData.campaignRule(game, 'donationThresholds').filter(rate => donations >= rate).length;
        },
        prosperityBreaks(game) {
            return collect(gameData.prosperity(game).breaks);
        },
        calculateProsperity(prosperityIndex, game) {
            return this.prosperityBreaks(game)
                .filter((prosperity, index) => prosperityIndex >= index)
                .last();
        },
        unlockedItems(items, game = 'gh') {
            // Ids aren't always numeric: crossover packs like the Mercenary
            // Pack use ids such as "AN", which Number() would turn into NaN.x
            let filteredItems = collect(items).filter().keys().all().map((id) => isNaN(id) ? id : Number(id))
            return this.prependGame(game, filteredItems);
        },
        // CS uses the GH "base" items and adds a few more
        calculateItemsGh(unlockedItems, prosperityIndex) {
            const {lastItems} = gameData.prosperity('gh');
            let prosperityItems = Helpers.makeArrayWithNumbers(lastItems[this.calculateProsperity(prosperityIndex) - 1])
            prosperityItems = this.prependGame('gh', prosperityItems);

            return _.uniq(prosperityItems.concat(unlockedItems));
        },
        calculateItemsGh2(unlockedItems, prosperityIndex) {
            // Item 116 was unlocked for everyone by the FAQ.
            const {lastItems, alwaysAvailable} = gameData.prosperity('gh2');
            const prosperityItems = Helpers.makeArrayWithNumbers(lastItems[this.calculateProsperity(prosperityIndex, 'gh2') - 1]).concat(alwaysAvailable);

            return _.uniq(this.prependGame('gh2', prosperityItems).concat(unlockedItems));
        },
        calculateItemsFh(unlockedItems, buildingRepository) {
            const shop = gameData.shop('fh');

            // Initially available items, then those unlocked by building upgrades
            let availableItems = [...expandItems(shop.initial), ...buildingItems(shop.buildings, buildingRepository)];

            // The rest are available through scenario/treasure/event rewards,
            // and are listed as `itemDesigns` in CampaignSheet.js,
            // to be toggled manually and passed to this function from Items.vue as `unlockedItems`.

            availableItems = this.prependGame('fh', availableItems);

            // Sorted because FH is the only game where the unlockedItems aren't strictly at the end.
            // .slice(3) is because the unlockedItems are passed with 'fh-' prepended.
            // Crossover ids (e.g. "fh-AN") aren't numeric after the prefix, fall back to string sorting for those.
            return _.uniq(availableItems.concat(unlockedItems).sort((a, b) => {
                const aNum = +a.slice(3), bNum = +b.slice(3);
                return isNaN(aNum) || isNaN(bNum) ? a.localeCompare(b) : aNum - bNum;
            }));
        },
        calculateCrossGhItems(buildingRepository) {
            const shop = gameData.shop('fh').gloomhaven;

            return [...expandItems(shop.initial), ...buildingItems(shop.buildings, buildingRepository)].sort();
        },
        calculateItemsJotl(unlockedItems, scenarioRepository) {
            let shopItems = [];

            const itemRewards = gameData.shop('jotl').scenarios;

            for (const scenarioId in itemRewards) {
                if (scenarioRepository.find(scenarioId).isComplete()) {
                    shopItems.push(...expandItems(itemRewards[scenarioId]));
                }
            }

            shopItems = this.prependGame('jotl', shopItems);

            return _.uniq(shopItems.concat(unlockedItems));
        },
        // Shop items for the sheet's game, plus enabled cross-game items. Expects the
        // component to hold itemRepository, scenarioRepository and buildingRepository.
        shopItems(sheet) {
            const game = sheet.game === 'fc' ? 'gh' : sheet.game;
            const unlockedItems = this.unlockedItems(sheet.itemDesigns, game);
            const prosperityIndex = sheet.effectiveProsperityIndex;

            const sheetItems = {
                jotl: () => this.calculateItemsJotl(unlockedItems, this.scenarioRepository),
                fh: () => this.calculateItemsFh(unlockedItems, this.buildingRepository),
                gh2: () => this.calculateItemsGh2(unlockedItems, prosperityIndex),
            }[game]?.() ?? this.calculateItemsGh(unlockedItems, prosperityIndex);

            let items = this.itemRepository.findMany(sheetItems);
            if (!sheet.crossGameItemsEnabled) {
                return items;
            }

            collect(sheet.crossGameItems).filter().keys().all().forEach(otherGame => {
                let otherItems;
                if (game === 'fh') {
                    // FH picks single items per game.
                    otherItems = this.itemRepository.findMany(this.unlockedItems(sheet.crossGameItems[otherGame], otherGame));
                } else if (otherGame === game) {
                    return;
                } else if (otherGame === 'gh' && game !== 'jotl') {
                    otherItems = this.itemRepository.findMany(this.calculateItemsGh([], prosperityIndex));
                } else {
                    // Games without prosperity add all their items.
                    otherItems = this.itemRepository.fromGame(otherGame);
                }
                items = collect({...items.all(), ...otherItems.all()});
            });

            return items;
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
                    value: gameData.campaignRule(game, 'goldConversion')[level] || 2,
                },
                trapDamage: {
                    label: this.$t('Trap damage'),
                    value: level + 2
                }
            }

            const hazardousTerrain = gameData.campaignRule(game, 'hazardousTerrain');
            if (hazardousTerrain) {
                rows.hazardousTerrain = {
                    label: this.$t('Hazardous terrain'),
                    value: hazardousTerrain[level] || 2
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
