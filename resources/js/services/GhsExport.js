import {Game} from "../models/Game";

// Builds a game file for Gloomhaven Secretariat (GHS): Menu > Data management > Import file.
// GHS fills missing fields with its GameModel defaults and adds the monsters on "Restart Scenario".
// Tracker class id => [GHS edition, GHS class, health at level 1]. GHS reads health from the file, not from the class.
const CLASSES = {
    BR: ['gh', 'brute', 10], CH: ['gh', 'cragheart', 10], SW: ['gh', 'spellweaver', 6], TI: ['gh', 'tinkerer', 8],
    SC: ['gh', 'scoundrel', 8], MT: ['gh', 'mindthief', 6], DS: ['gh', 'angry-face', 8], EL: ['gh', 'triangles', 6],
    SB: ['gh', 'saw', 8], SS: ['gh', 'music-note', 6], SK: ['gh', 'sun', 10], NS: ['gh', 'eclipse', 8],
    SU: ['gh', 'circles', 8], BE: ['gh', 'lightning', 10], QM: ['gh', 'three-spears', 10], PH: ['gh', 'squidface', 6],
    BT: ['gh', 'two-mini', 6], BS: ['gh', 'envx', 8],
    DR: ['fc', 'diviner', 6],

    BR2: ['gh2e', 'bruiser', 10], CH2: ['gh2e', 'cragheart', 10], MT2: ['gh2e', 'mindthief', 6],
    SC2: ['gh2e', 'silent-knife', 8], SW2: ['gh2e', 'spellweaver', 6], TI2: ['gh2e', 'tinkerer', 8],
    BE2: ['gh2e', 'lightning', 10], BS2: ['gh2e', 'crossed-swords', 8], DS2: ['gh2e', 'angry-face', 8],
    EL2: ['gh2e', 'triangles', 6], NS2: ['gh2e', 'eclipse', 8], PH2: ['gh2e', 'squidface', 6],
    QM2: ['gh2e', 'three-spears', 10], SB2: ['gh2e', 'saw', 8], SK2: ['gh2e', 'sun', 10],
    SS2: ['gh2e', 'music-note', 6], ST2: ['gh2e', 'circles', 6], WF2: ['gh2e', 'two-mini', 6],

    DF: ['fh', 'drifter', 10], BB: ['fh', 'blinkblade', 8], BN: ['fh', 'banner-spear', 10], DW: ['fh', 'deathwalker', 6],
    BO: ['fh', 'boneshaper', 6], GE: ['fh', 'geminate', 8], IF: ['fh', 'astral', 8], PY: ['fh', 'meteor', 8],
    SH: ['fh', 'shards', 8], TA: ['fh', 'trap', 6], PC: ['fh', 'shackles', 8], SD: ['fh', 'snowflake', 8],
    FF: ['fh', 'fist', 10], HV: ['fh', 'prism', 8], ME: ['fh', 'drill', 10], DT: ['fh', 'kelp', 8],
    CR: ['fh', 'coral', 10],

    RG: ['jotl', 'red-guard', 10], DM: ['jotl', 'demolitionist', 8], HT: ['jotl', 'hatchet', 8],
    VW: ['jotl', 'voidwarden', 6],

    AA: ['cs', 'beetle', 12], QA: ['cs', 'tools', 7], BM: ['cs', 'target', 10], BK: ['cs', 'flask', 8],
    CG: ['cs', 'chain-helmet', 10], CT: ['cs', 'tusks', 8], FK: ['cs', 'ladder-axe', 9], HP: ['cs', 'leaf', 6],
    HO: ['cs', 'vortex', 7], LU: ['cs', 'crescent-sun', 10], MF: ['cs', 'sprig', 6], RM: ['cs', 'bleeding-claw', 8],
    SP: ['cs', 'skull', 6], ST: ['cs', 'galaxy', 6],

    SA: ['mp', 'satha', 10], HA: ['mp', 'hail', 8], CA: ['mp', 'cassandra', 6], AN: ['mp', 'anaphi', 6],
};

// Health for levels 1-9, keyed by the health at level 1.
const HEALTH = {
    6: [6, 7, 8, 9, 10, 11, 12, 13, 14],
    7: [7, 8, 9, 10, 12, 13, 14, 15, 17],
    8: [8, 9, 11, 12, 14, 15, 17, 18, 20],
    9: [9, 10, 12, 14, 16, 17, 19, 21, 23],
    10: [10, 12, 14, 16, 18, 20, 22, 24, 26],
    12: [12, 14, 17, 19, 22, 24, 27, 29, 32],
};

const GHS_GAME_EDITIONS = {[Game.gh]: 'gh', [Game.fc]: 'gh', [Game.gh2]: 'gh2e', [Game.fh]: 'fh', [Game.jotl]: 'jotl', [Game.cs]: 'cs'};

export default class GhsExport {

    make(sheet, game, scenario) {
        return {
            revision: 0,
            edition: GHS_GAME_EDITIONS[game],
            characters: Object.values(sheet.characters).filter(character => CLASSES[character.id])
                .map(character => this.character(CLASSES[character.id], character)),
            scenario: this.scenario(scenario),
            state: 'draw',
            levelAdjustment: sheet.scenarioLevel || 0,
        };
    }

    scenario(scenario) {
        // GHS has Seeker of Xorn as its own edition, numbered 1-3.
        const seekerOfXorn = String(scenario.id).match(/^SoX(\d+)$/);
        if (seekerOfXorn) {
            return {index: seekerOfXorn[1], edition: 'sox'};
        }

        return {
            index: String(scenario.displayId),
            edition: scenario.game === Game.gh2 ? 'gh2e' : scenario.game,
            // Crimson Scales class scenarios (e.g. AA1) are grouped by class in GHS.
            group: String(scenario.id).match(/^[A-Z]{2}(?=\d)/)?.[0],
        };
    }

    character([edition, name, baseHealth], character) {
        const health = HEALTH[baseHealth][character.level - 1];

        return {
            name, edition, title: character.name, level: character.level, health, maxHealth: health,
            initiative: 0, experience: 0, loot: 0, summons: [],
        };
    }
}
