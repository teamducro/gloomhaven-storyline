import SheetCalculations from "./SheetCalculations";
import BuildingRepository from "../repositories/BuildingRepository";
import GameData from "./GameData";

// Types whose cost doesn't double for multi-target abilities.
export const noMultiTargetDouble = ['target', 'summon_move', 'summon_attack', 'summon_range', 'summon_hp', 'fire', 'ice', 'air', 'earth', 'light', 'dark', 'wild_element', 'attack_hex'];

// Enhancements that just add +1 to a stat already printed on the card
export const numericBoostTypes = [
    'move', 'attack', 'range', 'shield', 'push', 'pull', 'pierce', 'retaliate', 'heal',
    'target', 'teleport', 'summon_move', 'summon_attack', 'summon_range', 'summon_hp',
];

// Reuses the existing translation keys already used elsewhere in the app.
const labels = {
    move: 'Move',
    attack: 'Attack',
    range: 'Range',
    shield: 'Shield',
    push: 'PUSH',
    pull: 'PULL',
    pierce: 'PIERCE',
    retaliate: 'Retaliate',
    heal: 'Heal',
    target: 'TARGET',
    teleport: 'TELEPORT',
    summon_move: 'Summon Move',
    summon_attack: 'Summon Attack',
    summon_range: 'Summon Range',
    summon_hp: 'Summon HP',
    regenerate: 'REGENERATE',
    ward: 'WARD',
    poison: 'POISON',
    wound: 'WOUND',
    muddle: 'MUDDLE',
    immobilize: 'IMMOBILIZE',
    disarm: 'DISARM',
    curse: 'CURSE',
    strengthen: 'STRENGTHEN',
    bless: 'BLESS',
    jump: 'Jump',
    fire: 'Fire',
    ice: 'Ice',
    air: 'Air',
    earth: 'Earth',
    light: 'Light',
    dark: 'Dark',
    wild_element: 'Wild Element',
    attack_hex: 'Attack Hex',
};

export default {
    methods: {
        // Base gold cost per type (`enhancements` in games/<game>.json): classic rules for gh/cs/fc, Frosthaven Appendix D, and
        // GH2e (rulebook Appendix D, p.65) which is Frosthaven's without Regenerate.
        enhancementBaseCosts(game) {
            return new GameData().enhancementCosts(game);
        },
        enhancementLabel(type) {
            return labels[type] || type;
        },
        enhancementDisplayLabel(type) {
            const label = this.titleCase(this.$t(this.enhancementLabel(type)));
            return numericBoostTypes.includes(type) ? label + ' +1' : label;
        },
        // Some translation keys (shared with the Conditions reference) are ALL CAPS by convention.
        titleCase(text) {
            return text === text.toUpperCase() ? text.charAt(0) + text.slice(1).toLowerCase() : text;
        },
        // Frosthaven: enhancements are bought at building #44 "Enhancer", which
        // can't be used before it's built or while it's wrecked. A damaged building stays in use.
        enhancerUsable(game) {
            if (game !== 'fh') {
                return true;
            }

            const enhancer = new BuildingRepository().find(44);
            return !!enhancer && (enhancer.isBuilt() || enhancer.isDamaged());
        },
        // Enhancer level 2+ knocks 10 gold off every enhancement, level 3+ also cuts the
        // per-level penalty by 10, level 4 also cuts the repeat penalty by 25.
        enhancerLevel(game) {
            return game === 'fh' && this.enhancerUsable(game)
                ? new BuildingRepository().find(44).level
                : 0;
        },
        // Frosthaven, Mercenary Pack and GH2e classes use the Frosthaven card design, where the
        // lost/persistent enhancement cost multipliers apply (Appendix D).
        hasFrosthavenCards(character) {
            return ['fh', 'mp', 'gh2'].includes(character?.game);
        },
        // GH2e: a summon's inherent multi-target attack doubles its Attack and Range enhancements (FAQ 4.1).
        doublesForMultiTarget(type, game) {
            return !noMultiTargetDouble.includes(type)
                || (game === 'gh2' && ['summon_attack', 'summon_range'].includes(type));
        },
        calculateEnhancementCost({type, level, multiTarget, abilityProperty, frosthavenCard, previousCount, hexCount}, game) {
            const costs = this.enhancementBaseCosts(game);

            let cost = type === 'attack_hex'
                ? Math.ceil(costs.attack_hex / Math.max(1, hexCount || 1))
                : (costs[type] || 0);

            if (multiTarget && this.doublesForMultiTarget(type, game)) {
                cost *= 2;
            }

            // Lost/persistent multipliers only apply to Frosthaven-style cards.
            if (frosthavenCard) {
                // GH2e: lost halves, except summon actions, and there is no persistent multiplier.
                if (abilityProperty === 'lost' && !(game === 'gh2' && type.startsWith('summon_'))) {
                    cost *= 0.5;
                }
                // Persistent doesn't triple summon stat enhancements.
                else if (abilityProperty === 'persistent' && game !== 'gh2' && !type.startsWith('summon_')) {
                    cost *= 3;
                }
            }

            const enhancerLevel = this.enhancerLevel(game);

            // X cards are stored as level 1.5 and cost the same as level 1.
            cost += Math.max(0, Math.floor(level || 1) - 1) * (enhancerLevel >= 3 ? 15 : 25);
            cost += (previousCount || 0) * (enhancerLevel >= 4 ? 50 : 75);

            if (enhancerLevel >= 2) {
                cost -= 10;
            }

            return Math.max(0, Math.round(cost));
        },
        enhancementsUnlocked(sheet) {
            return !!sheet.enhancementsEnabled;
        },
        maxEnhancedCards(sheet) {
            if (sheet.game === 'gh2') {
                return Infinity; // GH2e FAQ 4.1: no limit
            }

            return SheetCalculations.methods.calculateProsperity(sheet.effectiveProsperityIndex, sheet.game);
        },
        enhancedCardCount(sheet, characterId) {
            return Object.values(sheet.enhancements[characterId] || {}).filter(list => list.length).length;
        },
    }
}
