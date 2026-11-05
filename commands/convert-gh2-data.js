#!/usr/bin/env node

// Converts the Gloomhaven Secretariat gh2e data into the scenarios, chapters and achievements of games/gh2.json and the gh2 lang blocks.
// Usage (from the repo root): node commands/convert-gh2-data.js
// The gh2 lang blocks must stay last in the lang files: writeLangBlock truncates everything after the first "gh2-" key.

const fs = require('fs');

const SRC = 'docs/GH 2nd/data/gloomhavensecretariat-gh2e';
const JS = 'resources/js';
const LOCALES = ['en', 'de', 'es', 'fr', 'hu', 'it', 'pl', 'pt', 'ru'];
const CHAPTERS = [
    {id: 1, name: 'Intro', group: 'intro'},
    {id: 2, name: 'The Sect', group: 'demons'},
    {id: 3, name: "Merchant's Guild", group: 'merchant-guild'},
    {id: 4, name: 'The Shields', group: 'city-guards'},
    {id: 5, name: 'Hail', group: 'hail'},
    {id: 6, name: 'The Voice and the Drake', group: 'the-voice'},
    {id: 7, name: 'The Sewers', group: 'the-sewers'},
    {id: 8, name: 'The Gloom', group: 'the-gloom'},
    {id: 9, name: 'Finale'},
    {id: 100, name: 'Solo Scenarios', group: 'solo'},
    {id: 101, name: 'Personal Quests', group: 'personal-quests'},
    {id: 102, name: 'Random Side Scenarios', group: 'random'},
    {id: 103, name: 'Puzzle Book', group: 'puzzle'},
    {id: 104, name: 'Events', group: 'events'},
    {id: 105, name: 'Reputation'},
];
// Secretariat leaves these without flowChartGroup.
const CHAPTER_FIXES = {'13': 6, '27': 9, '79': 105, '80': 105};
// Variant scenarios get integer ids (flowchart/validator need integers); `number` keeps the printed label.
const VARIANT_IDS = {'23A': 101, '23B': 102, '25A': 103, '25B': 104};
// Secret, repeatable, not on flowchart or map.
const SKIP = ['S'];
// 39.3 lists both Square A variants; the military one is 23B (23A is the demon path, unlocked by 26).
const SECTION_UNLOCK_FIXES = {'39.3': ['23B']};
const ACHIEVEMENTS = {
    'activating-the-device': 'G2ATD',
    'an-uneasy-peace': 'G2AUP',
    'ancient-technology': 'G2AT',
    'city-rule-demons': 'G2CRD',
    'city-rules-demons': 'G2CRD', // typo in section 57.3
    'city-rule-merchants': 'G2CRME',
    'city-rule-military': 'G2CRMI',
    'elements-mastered': 'G2EM',
    'end-of-corruption': 'G2EOC',
    'end-of-gloom': 'G2EOG',
    'hallowed-waters': 'G2HW',
    'into-the-depths': 'G2ITD',
    'peace-through-bloodshed': 'G2PTB',
    'the-candle-extinguished': 'G2TCE',
    'the-candle-kept': 'G2TCK',
    'the-darkness-retreats': 'G2TDR',
    'the-drake-aided': 'G2TDA',
    'the-drake-slain': 'G2TDS',
    'the-power-of-enhancement': 'G2TPE',
    'the-voice-freed': 'G2TVF',
    'the-voice-silenced': 'G2TVS',
};
// No scenario awards these.
const MANUAL = ['G2ATD', 'G2AUP'];
// Share the city rule banner slot, so only one applies at a time.
const CITY_RULES = ['G2AUP', 'G2CRD', 'G2CRME', 'G2CRMI'];
const FACTION = {demons: ['D', 'Demon'], 'merchant-guild': ['ME', 'Merchant'], military: ['MI', 'Military']};
const CLASSES = {
    bruiser: 'BR2', tinkerer: 'TI2', spellweaver: 'SW2', 'silent-knife': 'SC2', cragheart: 'CH2', mindthief: 'MT2',
    sun: 'SK2', 'three-spears': 'QM2', circles: 'ST2', eclipse: 'NS2', squidface: 'PH2', lightning: 'BE2',
    'music-note': 'SS2', 'angry-face': 'DS2', saw: 'SB2', triangles: 'EL2', 'two-mini': 'WF2', 'crossed-swords': 'BS2',
};
// Sticker coordinates + images, achievement banner x.
const gh2Map = require('./gh2-map');
const GENERATED = ['id', 'number', 'game', 'name', 'root', 'is_side', 'solo', 'chapter_id', 'links_to', 'linked_from',
    'choices', 'prompt', 'prompt_unlocks', 'required_by', 'requirements', 'blocks_on', 'treasures',
    'achievements_awarded', 'achievements_awarded_by_choice', 'rewards', 'has_boss', 'coordinates'];
const ACHIEVEMENT_GENERATED = ['id', 'name', 'type', 'game', 'is_manual', 'group', 'x', 'y'];

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const readDir = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => readJson(`${dir}/${f}`));
const parse = (src) => Function(`return ${src.replace(/^\s*export default/, '')}`)();
const unique = (list) => [...new Set(list)];
const isEmpty = (v) => v === undefined || (Array.isArray(v) && v.every((e) => Array.isArray(e) && e.length === 0));
const upperFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const byIndex = (a, b) => String(a.index).localeCompare(String(b.index), undefined, {numeric: true});

// 1. Load
const labels = readJson(`${SRC}/label/en.json`);
const spoilerItems = readJson(`${SRC}/label/spoiler/en.json`).items;
const items = new Map(readJson(`${SRC}/items.json`).map((i) => [String(i.id), i.name]));
const campaign = readJson(`${SRC}/campaign.json`);
const treasureList = readJson(`${SRC}/treasures.json`);
const bosses = new Set(readDir(`${SRC}/monster`).filter((m) => m.boss).map((m) => m.name));
const rawScenarios = readDir(`${SRC}/scenarios`).filter((s) => !SKIP.includes(s.index));
const sections = readDir(`${SRC}/sections`).sort(byIndex);
const sectionsByIndex = new Map(sections.map((s) => [s.index, s]));

// 2. Ids
const isSolo = (s) => s.group === 'solo';
const toId = (index) => VARIANT_IDS[index] || Number(index);
const appId = (s) => (isSolo(s) ? 200 + Number(s.index) - 84 : toId(s.index));
const rawKey = (s) => `${isSolo(s) ? 'solo' : ''}|${s.index}`;
const scenarioByKey = new Map(rawScenarios.map((s) => [rawKey(s), s]));
const nonSolo = new Map(rawScenarios.filter((s) => !isSolo(s)).map((s) => [s.index, s]));

const achievementId = (key) => {
    if (!ACHIEVEMENTS[key]) {
        throw new Error(`Unknown achievement ${key}`);
    }
    return ACHIEVEMENTS[key];
};
const achievementIds = (r) => (r.globalAchievements || []).map(achievementId);

// 3. Section -> scenario
function scenarioOf(section, depth = 0) {
    if (section.parent) {
        return scenarioByKey.get(`${section.group === 'solo' ? 'solo' : ''}|${section.parent}`);
    }
    const parent = section.parentSections && sectionsByIndex.get(section.parentSections[0][0]);
    return parent && depth < 10 ? scenarioOf(parent, depth + 1) : undefined;
}

const sectionsOf = new Map();
sections.forEach((section) => {
    const scenario = scenarioOf(section);
    if (scenario) {
        const list = sectionsOf.get(scenario) || [];
        list.push(section);
        sectionsOf.set(scenario, list);
    }
});

// 4. Unlock resolution
function resolveUnlock(index, source) {
    if (nonSolo.has(index)) {
        return toId(index);
    }
    const variant = ['A', 'B'].map((v) => index + v).find((v) => nonSolo.has(v) && nonSolo.get(v).flowChartGroup === source.flowChartGroup);
    if (!variant) {
        throw new Error(`Cannot resolve unlock ${index} of scenario ${source.index}`);
    }
    return toId(variant);
}

// 6.3 texts
const factionLabel = (f) => labels.factions.gh2e[f];
const itemName = (id) => (spoilerItems[`gh2e-${id}`] || {})[''] || items.get(id);
const itemText = (id) => {
    // "37-2" means two copies of item 37.
    const [n, copies] = String(id).split('-').map((part) => String(parseInt(part, 10)));
    return `Gain ${copies ? copies + '× ' : ''}“${itemName(n)}” (Item ${n})`;
};

function rewardTexts(r = {}) {
    const texts = [];
    if (r.gold) texts.push(`${r.gold} gold each`);
    if (r.experience) texts.push(`${r.experience} experience each`);
    if (r.battleGoals) texts.push(`${r.battleGoals} ✔ each`);
    if (r.prosperity) texts.push(`+${r.prosperity} prosperity`);
    (r.reputationFactions || []).forEach((entry) => {
        const [faction, value] = entry.split(':');
        texts.push(`${value > 0 ? '+' : ''}${value} ${factionLabel(faction)} reputation`);
    });
    (r.items || []).forEach((id) => texts.push(itemText(id)));
    (r.events || []).forEach((event) => {
        const [type, id] = event.split(':');
        texts.push(`Add ${type} event ${id} to the deck`);
    });
    (r.envelopes || []).forEach((envelope) => {
        const faction = envelope.match(/%data\.gh2eFaction:(.+)%/);
        texts.push(`Open envelope “${upperFirst(faction ? factionLabel(faction[1]) : envelope)}”`);
    });
    if (r.characterRetirement) texts.push(`Personal quest ${r.characterRetirement} complete`);
    if (r.randomSideScenario) texts.push('Unlock a random side scenario');
    if (r.hints && r.hints.gold) {
        const ref = r.hints.gold.match(/%data\.scenario\.rewards\.gh2e\.(\w+)\.(\d+)%/);
        texts.push(ref ? labels.scenario.rewards.gh2e[ref[1]][ref[2]] : r.hints.gold);
    }
    return texts;
}

function treasureText(entry) {
    const parse = (part) => {
        const [type, value] = part.split(':');
        switch (type) {
            case 'item': return itemText(value);
            case 'gold': return `Gain ${value} gold`;
            case 'experience': return `Gain ${value} experience`;
            case 'battleGoal': return `Gain ${value} ✔`;
            case 'damage': return `Suffer ${value} damage`;
            case 'condition': return `gain ${value.split('+').map((c) => `{${c.toUpperCase()}}`).join(' and ')}`;
            case 'recover': return `Recover ${value} lost cards`;
            case 'randomItemDesign': return 'Random Item Design';
            case 'randomScenario': return 'Random Side Scenario';
            default: throw new Error(`Unknown treasure ${part}`);
        }
    };
    // 'Gain A and B', not 'Gain A and Gain B'.
    return upperFirst(entry.split('|').map((part, i) => (i ? parse(part).replace(/^Gain /, '') : parse(part))).join(' and '));
}

// 5. Scenarios
const out = new Map();
const links = new Map();
const blocks = new Map();
const addLink = (from, to) => links.set(to, unique([...(links.get(to) || []), from]));
const addBlock = (id, condition) => {
    const list = blocks.get(id) || [];
    if (!list.some((c) => JSON.stringify(c) === JSON.stringify(condition))) {
        list.push(condition);
    }
    blocks.set(id, list);
};

rawScenarios.forEach((s) => {
    const o = {id: appId(s), game: 'gh2', name: s.name};
    const r = s.rewards || {};
    const conclusions = (sectionsOf.get(s) || []).filter((c) => c.conclusion);
    const scenarioSections = [s, ...(sectionsOf.get(s) || [])];

    if (VARIANT_IDS[s.index]) o.number = s.index;
    if (s.initial && !isSolo(s)) o.root = true;
    if (isSolo(s)) o.solo = CLASSES[s.solo];
    o.chapter_id = isSolo(s) ? 100 : CHAPTER_FIXES[s.index] || (s.flowChartGroup && (CHAPTERS.find((c) => c.group === s.flowChartGroup) || {}).id);

    o.achievements_awarded = achievementIds(r);
    (s.blocks || []).forEach((b) => addBlock(toId(b), {complete: [o.id]}));
    conclusions.forEach((c) => {
        if ((c.blocks || []).length && !achievementIds(c.rewards || {}).length) {
            throw new Error(`Section ${c.index} blocks but awards no achievement`);
        }
        (c.blocks || []).forEach((b) => addBlock(toId(b), {complete: achievementIds(c.rewards)}));
    });

    const scenarioUnlocks = (s.unlocks || []).map((u) => resolveUnlock(u, s));
    const sectionUnlocks = conclusions.map((c) => (c.unlocks || []).map((u) => resolveUnlock(u, s)));
    const base = scenarioUnlocks.filter((id) => !sectionUnlocks.some((list) => list.includes(id)));

    o.rewards = rewardTexts(r);
    if (conclusions.length === 0) {
        o.links_to = scenarioUnlocks;
    } else if (conclusions.length === 1) {
        o.achievements_awarded = [...o.achievements_awarded, ...achievementIds(conclusions[0].rewards || {})];
        o.rewards = [...o.rewards, ...rewardTexts(conclusions[0].rewards)];
        o.links_to = unique([...base, ...sectionUnlocks[0]]);
    } else {
        o.prompt = `gh2-${o.id}`;
        o.prompt_unlocks = sectionUnlocks.map((list) => [...base, ...list]);
        o.links_to = unique(o.prompt_unlocks.flat());
        o.choices = o.links_to;
        o.achievements_awarded_by_choice = conclusions.map((c) => achievementIds(c.rewards || {}));
        o.rewards = conclusions.map((c) => [...rewardTexts(r), ...rewardTexts(c.rewards)]);
        o.prompt_labels = conclusions.map((c) => `Section ${c.index}`);
    }

    o.treasures = unique(scenarioSections.flatMap((x) => (x.rooms || []).flatMap((room) => room.treasures || []))).sort((a, b) => a - b);
    const monsters = scenarioSections.flatMap((x) => [...(x.monsters || []), ...(x.rooms || []).flatMap((room) => (room.monster || []).map((m) => m.name))]);
    if (monsters.some((m) => bosses.has(m))) o.has_boss = true;
    if (!isSolo(s)) o.coordinates = gh2Map.coordinates(s.index, o.id);

    o.links_to.forEach((t) => addLink(o.id, t));
    out.set(o.id, o);
});

// 6. Reputation sections
const achievements = [];
const reputationAchievements = new Map();
campaign.reputationSections.forEach((rep) => {
    const targets = SECTION_UNLOCK_FIXES[rep.section] || (sectionsByIndex.get(rep.section) || {}).unlocks || [];
    if (!targets.length) return;

    const [code, name] = FACTION[rep.faction];
    const withFaction = !!rep.requires;
    const id = `P2R${withFaction ? code : ''}${rep.value}`;
    if (!reputationAchievements.has(id)) {
        reputationAchievements.set(id, {id, name: `${withFaction ? name : 'Faction'} Reputation ${rep.value}`, type: 'Party', game: 'gh2', is_manual: true});
    }
    targets.forEach((target) => {
        const t = toId(target);
        const requires = (rep.requires || []).map(toId);
        requires.forEach((from) => {
            addLink(from, t);
            out.get(from).links_to = unique([...out.get(from).links_to, t]);
        });
        out.get(t).required_by = [{complete: [...requires, id]}];
    });
});

// 7. Finish
const labelOf = (id) => {
    const scenario = out.get(id);
    return `#${scenario.number || scenario.id} ${scenario.name}`;
};
const allAchievements = new Map();
const globalKeys = Object.keys(labels.globalAchievements).sort();
globalKeys.forEach((key) => {
    const id = achievementId(key);
    const o = {id, name: labels.globalAchievements[key], type: 'Global', game: 'gh2'};
    if (MANUAL.includes(id)) o.is_manual = true;
    if (CITY_RULES.includes(id)) o.group = 'CR2';
    Object.assign(o, gh2Map.achievement(key));
    allAchievements.set(id, o);
});
reputationAchievements.forEach((a, id) => allAchievements.set(id, a));
achievements.push(...allAchievements.values());

out.forEach((o) => {
    o.linked_from = links.get(o.id) || [];
    o.blocks_on = blocks.get(o.id);
    const hasParent = o.linked_from.length > 0;
    if (!o.root && !o.solo && !hasParent) o.is_side = true;
    if (o.required_by) {
        o.requirements = o.required_by.map((condition) => condition.complete.map((m) => {
            if (Number.isInteger(m)) return labelOf(m);
            const a = allAchievements.get(m);
            return `${a.name} (${a.type})`;
        }).join(' and ')).join(' or ') + ' COMPLETE';
    }
});

// 8. Clean & order
const clean = (o) => {
    const result = {};
    GENERATED.forEach((key) => {
        if (key === 'prompt_unlocks' ? o.prompt : !isEmpty(o[key])) result[key] = o[key];
    });
    return result;
};
const scenarios = [...out.values()].sort((a, b) => a.id - b.id);
const promptLabels = new Map(scenarios.filter((o) => o.prompt_labels).map((o) => [o.id, o.prompt_labels]));
const cleaned = scenarios.map(clean);

// 9. Preserve hand-maintained data
function preserve(existing, fresh, generated) {
    const old = new Map(existing.map((e) => [e.id, e]));
    fresh.forEach((entry) => {
        const previous = old.get(entry.id) || {};
        Object.keys(previous).filter((k) => !generated.includes(k)).forEach((k) => (entry[k] = previous[k]));
    });
}
const gameFile = `${JS}/games/gh2.json`;
const game = readJson(gameFile);
preserve(game.scenarios, cleaned, GENERATED);
preserve(game.achievements, achievements, ACHIEVEMENT_GENERATED);

// 10. Write (only these keys; the rest of games/gh2.json is kept)
game.scenarios = cleaned;
game.chapters = CHAPTERS.map(({id, name}) => ({id, name})).sort((a, b) => a.id - b.id);
game.achievements = achievements.map((a) => Object.fromEntries(Object.entries(a).filter(([, v]) => v !== undefined)));
fs.writeFileSync(gameFile, JSON.stringify(game, null, 4) + '\n');

// 11. Lang
// Replaces the trailing "gh2-*" block of a lang file (always appended last) with `entries`.
function writeLangBlock(file, entries) {
    const src = fs.readFileSync(file, 'utf-8');
    const start = src.search(/\n\s*"gh2-/);
    const head = (start >= 0 ? src.slice(0, start) : src.slice(0, src.lastIndexOf('}'))).replace(/[\s,]*$/, '');
    const body = JSON.stringify(entries, null, 4).slice(1, -2);
    const outSrc = `${head},${body}\n}\n`;
    parse(outSrc); // throws on a broken file
    fs.writeFileSync(file, outSrc);
}

// English name -> localized name of the Gloomhaven 1e entries (`gh-*`), to reuse identical names.
function localizedNames(locale, file) {
    const english = parse(fs.readFileSync(`${JS}/lang/en/${file}.js`, 'utf-8'));
    const local = parse(fs.readFileSync(`${JS}/lang/${locale}/${file}.js`, 'utf-8'));
    const names = {};
    Object.keys(english).filter((k) => k.startsWith('gh-')).forEach((k) => {
        if (local[k] && local[k].name) names[english[k].name] = local[k].name;
    });
    return names;
}

const secretariatTitles = (locale) => {
    const file = `${SRC}/label/${locale}.json`;
    const titles = fs.existsSync(file) && (((readJson(file).scenario || {}).title || {}).gh2e);
    return titles || {};
};
const rawIndexOf = new Map(rawScenarios.map((s) => [appId(s), isSolo(s) ? `solo-${s.index}` : s.index]));

LOCALES.forEach((locale) => {
    const scenarioNames = localizedNames(locale, 'scenarios');
    const achievementNames = localizedNames(locale, 'achievements');
    const titles = secretariatTitles(locale);
    const dir = `${JS}/lang/${locale}`;

    const scenarioLang = {};
    scenarios.forEach((o) => {
        const entry = {name: titles[rawIndexOf.get(o.id)] || scenarioNames[o.name] || o.name};
        if (o.rewards) entry.rewards = o.rewards;
        scenarioLang[`gh2-${o.id}`] = entry;
    });
    writeLangBlock(`${dir}/scenarios.js`, scenarioLang);

    const achievementLang = {};
    achievements.forEach((a) => (achievementLang[`gh2-${a.id}`] = {name: achievementNames[a.name] || a.name}));
    writeLangBlock(`${dir}/achievements.js`, achievementLang);

    const treasureLang = {};
    treasureList.forEach((entry, i) => (treasureLang[`gh2-${i + 1}`] = {name: treasureText(entry)}));
    writeLangBlock(`${dir}/treasures.js`, treasureLang);

    const promptLang = {};
    promptLabels.forEach((optionLabels, id) => {
        const entry = {};
        optionLabels.forEach((label, i) => (entry[String(i + 1)] = label));
        entry.title = out.get(id).name;
        entry.text = 'Which conclusion section did you read?';
        promptLang[`gh2-${id}`] = entry;
    });
    writeLangBlock(`${dir}/prompts.js`, promptLang);
});

// Self-check
const ids = new Set(scenarios.map((o) => o.id));
const must = (cond, message) => {
    if (!cond) throw new Error(`Self-check failed: ${message}`);
};
must(ids.size === scenarios.length && [...ids].every(Number.isInteger), 'ids unique integers');
const achievementIdSet = new Set(achievements.map((a) => a.id));
cleaned.forEach((o) => {
    must(o.solo || o.chapter_id, `chapter for ${o.id}`);
    ['links_to', 'linked_from', 'choices'].forEach((k) => (o[k] || []).forEach((id) => must(ids.has(id), `${k} ${id} of ${o.id}`)));
    (o.prompt_unlocks || []).flat().forEach((id) => must(ids.has(id), `prompt_unlocks ${id} of ${o.id}`));
    (o.links_to || []).forEach((id) => must(cleaned.find((x) => x.id === id).linked_from.includes(o.id), `asymmetric ${o.id} -> ${id}`));
    (o.linked_from || []).forEach((id) => must(cleaned.find((x) => x.id === id).links_to.includes(o.id), `asymmetric ${id} -> ${o.id}`));
    if (o.choices) (o.links_to || []).forEach((id) => must(o.choices.includes(id), `choice ${id} of ${o.id}`));
    [...(o.required_by || []), ...(o.blocks_on || [])].forEach((c) => c.complete.filter((m) => !Number.isInteger(m)).forEach((a) => must(achievementIdSet.has(a), `achievement ${a}`)));
    [...(o.achievements_awarded || []), ...(o.achievements_awarded_by_choice || []).flat()].forEach((a) => must(achievementIdSet.has(a), `achievement ${a}`));
    if (o.prompt) must(o.rewards === undefined || o.rewards.length === o.prompt_unlocks.length, `rewards of ${o.id}`);
});

console.log(`${cleaned.length} scenarios, ${achievements.length} achievements`);
