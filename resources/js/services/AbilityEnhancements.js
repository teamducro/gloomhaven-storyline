import SheetCalculations from "./SheetCalculations";
import BuildingRepository from "../repositories/BuildingRepository";

// Base gold cost per enhancement type, classic rules (gh/cs/fc), corebook Appendix (p.47).
const classicCosts = {
    move: 30,
    attack: 50,
    range: 30,
    shield: 100,
    push: 30,
    pull: 30,
    pierce: 30,
    retaliate: 100,
    heal: 30,
    target: 50,
    summon_move: 100,
    summon_attack: 100,
    summon_range: 50,
    summon_hp: 50,
    poison: 75,
    wound: 75,
    muddle: 50,
    immobilize: 100,
    disarm: 150,
    curse: 75,
    strengthen: 50,
    bless: 50,
    jump: 50,
    fire: 100,
    ice: 100,
    air: 100,
    earth: 100,
    light: 100,
    dark: 100,
    wild_element: 150,
    attack_hex: 200,
};

// Base gold cost per enhancement type, Frosthaven rules, Appendix D.
const frosthavenCosts = {
    move: 30,
    attack: 50,
    range: 30,
    target: 75,
    shield: 80,
    retaliate: 60,
    pierce: 30,
    heal: 30,
    push: 30,
    pull: 20,
    teleport: 50,
    summon_hp: 40,
    summon_move: 60,
    summon_attack: 100,
    summon_range: 50,
    regenerate: 40,
    ward: 75,
    strengthen: 100,
    bless: 75,
    wound: 75,
    poison: 50,
    immobilize: 150,
    muddle: 40,
    curse: 150,
    fire: 100,
    ice: 100,
    air: 100,
    earth: 100,
    light: 100,
    dark: 100,
    wild_element: 150,
    jump: 60,
    attack_hex: 200,
};

// Types whose cost doesn't double for multi-target abilities.
const noMultiTargetDouble = ['target', 'fire', 'ice', 'air', 'earth', 'light', 'dark', 'wild_element', 'attack_hex'];

// Enhancements that just add +1 to a stat already printed on the card (Appendix D) share
// one generic "+1" sticker rather than a per-type icon; keyword/condition additions keep theirs.
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
        enhancementBaseCosts(game) {
            return game === 'fh' ? frosthavenCosts : classicCosts;
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
        // Building #44 "Enhancer" (Frosthaven, Appendix D): level 2+ knocks 10 gold off every
        // enhancement, level 3+ also cuts the per-level penalty by 10, level 4 also cuts the
        // repeat penalty by 25.
        enhancerLevel(game) {
            return game === 'fh'
                ? (new BuildingRepository().find(44)?.level || 0)
                : 0;
        },
        calculateEnhancementCost({type, level, multiTarget, abilityProperty, previousCount, hexCount}, game) {
            const costs = this.enhancementBaseCosts(game);

            let cost = type === 'attack_hex'
                ? Math.ceil(costs.attack_hex / Math.max(1, hexCount || 1))
                : (costs[type] || 0);

            if (multiTarget && !noMultiTargetDouble.includes(type)) {
                cost *= 2;
            }

            if (abilityProperty === 'lost') {
                cost *= 0.5;
            } else if (abilityProperty === 'persistent') {
                cost *= 3;
            }

            const enhancerLevel = this.enhancerLevel(game);

            cost += Math.max(0, Math.round(level || 1) - 1) * (enhancerLevel >= 3 ? 15 : 25);
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
            return SheetCalculations.methods.calculateProsperity(sheet.prosperityIndex, sheet.game);
        },
        enhancedCardCount(sheet, characterId) {
            return Object.values(sheet.enhancements[characterId] || {}).filter(list => list.length).length;
        },
    }
}
