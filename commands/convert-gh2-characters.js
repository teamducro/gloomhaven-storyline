#!/usr/bin/env node
// Converts GH2e classes (docs/GH 2nd, gitignored sources) into the characters, characterOrder and abilities of games/gh2.json,
// lang/en/{characters,abilities}.js and, with --images, resources/img/{abilities/gh2,character-mats}.
// Usage (repo root): node commands/convert-gh2-characters.js [--images]
const fs = require('fs');
const {execFileSync} = require('child_process');
const slugify = require('slugify');

const SRC = 'docs/GH 2nd/';
const SECRETARIAT = SRC + 'data/gloomhavensecretariat-gh2e/';
const JS = 'resources/js/';
const WITH_IMAGES = process.argv.includes('--images');

// [id, secretariat file, 1e id (icon + back), 2e back file or null, mat front (card-browser file, else wordhaven front), wordhaven mat file]
const CLASSES = [
    ['BR2', 'bruiser', 'BR', null, 'gh2-bruiser.jpeg', 'bruiser'],
    ['CH2', 'cragheart', 'CH', null, 'gh2-cragheart.jpeg', 'cragheart'],
    ['MT2', 'mindthief', 'MT', null, 'gh2-mindthief.jpeg', 'mindthief'],
    ['SC2', 'silent-knife', 'SC', null, 'gh2-silentknife.jpeg', 'silent-knife'],
    ['SW2', 'spellweaver', 'SW', null, 'gh2-spellweaver.jpeg', 'spellweaver'],
    ['TI2', 'tinkerer', 'TI', null, 'gh2-tinkerer.jpeg', 'tinkerer'],
    ['BE2', 'lightning', 'BE', 'berserker', 'gh2-berserker.jpeg', 'berserker'],
    ['BS2', 'crossed-swords', 'BS', 'bladeswarm', 'gh2-bladeswarm.jpeg', 'bladeswarm'],
    ['DS2', 'angry-face', 'DS', 'doom-stalker', 'gh2-doomstalker.jpeg', 'doomstalker'],
    ['EL2', 'triangles', 'EL', 'elementalist', 'gh2-elementalist.jpeg', 'elementalist'],
    ['NS2', 'eclipse', 'NS', null, 'gh2-nightshroud.jpeg', 'nightshroud'],
    ['PH2', 'squidface', 'PH', 'plagueherald', 'gh2-plagueherald.jpeg', 'plagueherald'],
    ['QM2', 'three-spears', 'QM', 'quartermaster', 'gh2-quartermaster.jpeg', 'quartermaster'],
    ['SB2', 'saw', 'SB', 'sawbones', 'gh2-sawbones.jpeg', 'sawbones'],
    ['SK2', 'sun', 'SK', 'sunkeeper', 'gh2-sunkeeper.jpeg', 'sunkeeper'],
    ['SS2', 'music-note', 'SS', 'soothsinger', 'gh2-soothsinger.jpeg', 'soothsinger'],
    ['ST2', 'circles', 'SU', 'soultether', null, 'soultether'],
    ['WF2', 'two-mini', 'BT', 'wildfury', 'gh2-wildfury.jpeg', 'wildfury'],
];
const STARTERS = ['BR2', 'CH2', 'MT2', 'SC2', 'SW2', 'TI2'];
const NAME_OVERRIDES = {'MT2/feedback loops': 'feedback loop', 'PH2/deliriums danse': "delirium's danse"};
const LEVEL_OVERRIDES = {};
const INITIATIVE_OVERRIDES = {};
const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const fail = (message) => { throw new Error(message); };

// Labels

const deepMerge = (target, source) => {
    for (const [key, value] of Object.entries(source)) {
        if (value && typeof value === 'object' && target[key] && typeof target[key] === 'object') {
            deepMerge(target[key], value);
        } else {
            target[key] = value;
        }
    }
    return target;
};
const LABELS = deepMerge(readJson(SECRETARIAT + 'label/en.json'), readJson(SECRETARIAT + 'label/spoiler/en.json'));

const className = (file) => {
    const value = LABELS.character.gh2e[file];
    return typeof value === 'object' ? value[''] : value;
};

const label = (path) => path.split('.').reduce((node, key) => node?.[key], LABELS);

// Text: resolve Secretariat placeholders into app tokens

const ACTIONS = {attack: 'ATTACK', move: 'MOVE', range: 'RANGE', heal: 'HEAL', retaliate: 'RETALIATE', shield: 'SHIELD',
    target: 'TARGET', teleport: 'TELEPORT', jump: 'JUMP', fly: 'FLYING', push: 'PUSH', pull: 'PULL', pierce: 'PIERCE'};
const CONDITIONS = ['bless', 'curse', 'disarm', 'immobilize', 'invisible', 'muddle', 'poison', 'stun', 'wound', 'strengthen', 'ward'];
const ELEMENTS = {fire: 'FIRE', ice: 'ICE', earth: 'EARTH', light: 'LIGHT', dark: 'DARK', air: 'WIND', wild: 'ANY'};
const ITEM_SLOTS = {body: 'BODY', small: 'SMALL-ITEM', onehand: 'ONE-HAND', twohand: 'TWO-HANDS'};
const CUSTOM_ACTIONS = {'gh2e-song': '{SONG}', 'gh2e-doom': '{DOOM}', 'gh2e-command': '{COMMAND}', 'gh2e-tear': 'tear',
    'gh2e-supplies': 'supplies', 'gh2e-prescription': 'prescription', 'gh2e-bear-summon': 'Bear'};

const placeholder = (inner) => {
    let m;
    if (m = inner.match(/^game\.action\.(\w+)\.valueSign:(.+)$/)) return `+${m[2]} {${ACTIONS[m[1]] || fail(inner)}.fh}`;
    if (m = inner.match(/^game\.action\.(\w+):(.+)$/)) {
        if (m[1] === 'loot') return `{LOOT ${m[2]}}`;
        return `{${ACTIONS[m[1]] || fail(inner)}.fh}${m[2]}`;
    }
    if (m = inner.match(/^game\.action\.(\w+)$/)) return `{${ACTIONS[m[1]] || fail(inner)}.fh}`;
    if (m = inner.match(/^game\.condition\.(\w+)$/)) {
        if (m[1] === 'safeguard') return '{SAFEGUARD_WHITE}';
        if (m[1] === 'plague') return 'plague';
        return CONDITIONS.includes(m[1]) ? `{${m[1].toUpperCase()}.fh}` : fail(inner);
    }
    if (inner === 'game.custom.perks.ignoreScenario') return 'Ignore scenario effects';
    if (inner === 'game.custom.perks.ignoreNegativeItemFh') return 'Ignore item {-1} effects';
    if (inner === 'game.element.consume.wild') return '{ANY_X}';
    if (m = inner.match(/^game\.element\.(\w+)$/)) return `{${ELEMENTS[m[1]] || fail(inner)}}`;
    if (m = inner.match(/^game\.elementHalf(\.consume)?:(\w+)\|(\w+)$/)) {
        const suffix = m[1] ? '_X' : '';
        return `{${ELEMENTS[m[2]] || fail(inner)}${suffix}}/{${ELEMENTS[m[3]] || fail(inner)}${suffix}}`;
    }
    const cardTokens = {'game.card.lost': '{LOST.fh}', 'game.card.recover': '{RECOVER.fh}', 'game.card.persistent': '{PERSISTENT}',
        'game.damage': '{DAMAGE.fh}', 'game.attackmodifier.double': '{2X_MODIFIER}', 'game.attackmodifier.plus0': '{+0_MODIFIER}'};
    if (cardTokens[inner]) return cardTokens[inner];
    if (m = inner.match(/^game\.card\.experience:(\d+)$/)) return `${m[1]} XP`;
    if (m = inner.match(/^game\.damage:(\d+)$/)) return `{DAMAGE.fh}${m[1]}`;
    if (m = inner.match(/^game\.itemSlot:(\w+)$/)) return `{${ITEM_SLOTS[m[1]] || fail(inner)}}`;
    if (m = inner.match(/^game\.characterIcon\.([\w-]+)$/)) {
        return className(m[1] === 'envx' ? 'crossed-swords' : m[1]) || fail(inner);
    }
    if (m = inner.match(/^data\.action\.custom\.([\w-]+)$/)) return CUSTOM_ACTIONS[m[1]] || fail(inner);
    if (m = inner.match(/^data\.(.+)$/)) {
        const value = label(m[1]);
        return typeof value === 'string' ? text(value) : fail('Missing label ' + inner);
    }
    return fail('Unknown placeholder %' + inner + '%');
};

// Typos in the source perk texts
const TEXT_FIXES = [
    ['may %game.card.recover% on level', 'may %game.card.recover% one level'],
    ["your or one ally's donation", "you or one ally's donation"],
    ['if an ally as an active', 'if an ally has an active'],
    ['from on ally', 'from one ally'],
    ['to all its attack,', 'to all its attacks,'],
    ['treat and %game.attackmodifier.double%', 'treat any %game.attackmodifier.double%'],
];

const text = (str) => TEXT_FIXES.reduce((fixed, [from, to]) => fixed.replace(from, to), str)
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/%([^%]+)%/g, (_, inner) => placeholder(inner));

// Attack modifier cards

const VALUE_TOKENS = {plus0: '{+0_WHITE}', plus1: '{+1_WHITE}', plus2: '{+2_WHITE}', plus3: '{+3_WHITE}', plus4: '{+4_WHITE}',
    minus1: '{-1_WHITE}', minus2: '{-2_WHITE}', mis: '{NULL_MODIFIER}', times2: '{2X_MODIFIER}'};

const targetText = (value) => {
    if (value === 'self') return 'self';
    if (value === 'allyShort') return '{TARGET.fh}1 ally';
    return text(value);
};

const effectLabel = (effect, isNested = false) => {
    let result;
    switch (effect.type) {
        case 'condition':
            result = effect.value === 'safeguard' ? '{SAFEGUARD_WHITE}' : CONDITIONS.includes(effect.value) ? `{${effect.value.toUpperCase()}.fh}` : fail('condition ' + effect.value);
            break;
        case 'element':
            result = `{${ELEMENTS[effect.value] || fail('element ' + effect.value)}}`;
            break;
        case 'elementHalf':
            result = effect.value.split('|').map(e => `{${ELEMENTS[e] || fail('element ' + e)}}`).join('/');
            break;
        case 'heal': case 'shield': case 'push': case 'pull': case 'pierce': case 'retaliate': case 'range': case 'target':
            result = `{${ACTIONS[effect.type].toUpperCase()}.fh}${effect.value}`;
            break;
        case 'custom':
            result = text(effect.value);
            break;
        default:
            fail('Unknown effect ' + JSON.stringify(effect));
    }

    const nested = (effect.effects || []).map(e => e.type === 'specialTarget' ? targetText(e.value) : effectLabel(e, true));
    if (nested.length) {
        result += ', ' + nested.join(', ');
    }

    return !isNested && (nested.length || effect.type === 'custom') ? `“${result}”` : result;
};

const convertCard = (am) => {
    let type = am.type === 'null' ? 'mis' : am.type === 'double' ? 'times2' : am.type;
    if (!VALUE_TOKENS[type]) fail('Unknown card type ' + am.type);

    const card = {type};
    if (am.rolling) card.rolling = true;
    if (am.effects?.length) {
        card.effects = JSON.parse(JSON.stringify(am.effects), (key, value) => {
            return (key === 'value' && typeof value === 'string') ? text(value) : value;
        });
    }

    const parts = [];
    if (am.rolling) parts.push('{AGAIN}');
    if (!(am.rolling && type === 'plus0')) parts.push(VALUE_TOKENS[type]);
    (am.effects || []).forEach(effect => parts.push(effectLabel(effect)));
    card.label = parts.join(' ');

    return card;
};

// Perks

const cardsText = (cards) => cards.map(card => {
    const count = card.count || 1;
    return `${COUNT_WORDS[count]} ${card.attackModifier.label} card${count > 1 ? 's' : ''}`;
}).join(' and ');

const describe = (perk, converted) => {
    const custom = perk.custom || '';
    let prefix = '';
    if (custom === '%game.custom.perks.ignoreScenario%') prefix = 'Ignore scenario effects and ';
    else if (custom === '%game.custom.perks.ignoreNegativeItemFh%') prefix = 'Ignore item {-1} effects and ';
    else if (custom && perk.type !== 'custom') fail('Unknown perk custom ' + custom);

    if (perk.type === 'custom') return text(custom);

    const lower = (sentence) => prefix ? prefix + sentence.charAt(0).toLowerCase() + sentence.slice(1) : sentence;
    const cards = converted.cards.map(c => ({count: c.count, attackModifier: c.attackModifier}));

    if (perk.type === 'remove') return lower('Remove ' + cardsText(cards));
    if (perk.type === 'add') return lower('Add ' + cardsText(cards));
    if (perk.type === 'replace') {
        const removed = perk.replaceCount || 1;
        return lower(`Replace ${cardsText(cards.slice(0, removed))} with ${cardsText(cards.slice(removed))}`);
    }

    return fail('Unknown perk type ' + perk.type);
};

const convertPerk = (perk) => {
    const result = {type: perk.type, count: perk.count};
    if (perk.replaceCount) result.replaceCount = perk.replaceCount;
    if (perk.combined) result.linked = true;
    if (perk.custom === '%game.custom.perks.ignoreScenario%') result.custom = 'ignoreNegativeScenario';
    else if (perk.custom === '%game.custom.perks.ignoreNegativeItemFh%') result.custom = 'ignoreNegativeItem';
    if (perk.cards) {
        result.cards = perk.cards.map(card => ({count: card.count, attackModifier: convertCard(card.attackModifier)}));
    }

    return {perk: result, desc: describe(perk, result)};
};

// characters + lang

const convertCharacter = ([id, file, , ,], secretariat) => {
    const name = className(file) || fail('No name for ' + file);
    const perks = secretariat.perks.map(convertPerk);
    const masteries = secretariat.masteries.map(m => text(m));

    return {
        entry: {
            id,
            name,
            game: 'gh2',
            translatedName: `characters.${id}.name`,
            abilityCount: secretariat.handSize,
            starting_group: [STARTERS.includes(id) ? 'gh2_unlocked' : 'gh2_locked'],
            perks: perks.map(p => p.perk),
            masteries,
        },
        lang: {name, masteries, perks: perks.map(p => p.desc)},
    };
};

const writeCharactersJson = (entries) => {
    const file = JS + 'games/gh2.json';
    const data = readJson(file);
    data.characters = Object.fromEntries(entries.map(entry => [entry.id, entry]));
    data.characterOrder = entries.map(entry => entry.id);
    fs.writeFileSync(file, JSON.stringify(data, null, 4) + '\n');
};

const spliceLang = (file, marker, block) => {
    let content = fs.readFileSync(file, 'utf-8');
    // The gh2 block is always the tail of the file: drop it (and the comma before it) so reruns replace it.
    const start = content.indexOf(marker);
    const end = start === -1 ? content.lastIndexOf('}') : content.length;
    const before = content.slice(0, start === -1 ? end : start).replace(/[\s,]*$/, '');
    fs.writeFileSync(file, before + ',\n' + block + '\n}\n');
};

const writeCharactersLang = (langs) => {
    const body = Object.entries(langs).map(([id, lang]) => {
        const json = JSON.stringify({[id]: {name: lang.name, masteries: lang.masteries, perks: lang.perks}}, null, 4);
        return json.slice(json.indexOf('\n') + 1, json.lastIndexOf('\n'));
    }).join(',\n');
    spliceLang(JS + 'lang/en/characters.js', '"BR2": {', body);
};

// Abilities

const abilityName = (id, name) => NAME_OVERRIDES[`${id}/${name}`] || name.toLowerCase();
const abilityCode = (name) => slugify(name.replaceAll("'", '').replaceAll('.', ''), {lower: true});

const convertAbilities = () => {
    const cardBrowser = readJson(SRC + 'data/gloomhaven-card-browser/character-abilities-gloomhaven-2nd-edition.json');
    const abilities = cardBrowser.map((card, index) => {
        const id = card.image.split('/')[2];
        const rawName = card.name.trim();
        const name = abilityName(id, rawName);
        const key = `${id}/${name}`;
        const level = LEVEL_OVERRIDES[key] ?? (card.level === 'X' ? 1.5 : card.level === 'M' ? 0.1 : Number(card.level));
        if (Number.isNaN(level)) fail('Bad level for ' + key);

        return {
            name, game: 'gh2', character_id: id, level,
            initiative: INITIATIVE_OVERRIDES[key] ?? parseInt(card.initiative, 10),
            id: index + 1,
            _image: card.image.split('/').pop(),
        };
    });

    return abilities;
};

const diffSecretariat = (abilities) => {
    for (const [id, file] of CLASSES.map(c => [c[0], c[1]])) {
        const path = SECRETARIAT + `character/deck/${file}.json`;
        if (!fs.existsSync(path)) continue;
        const deck = readJson(path).abilities;
        const ours = abilities.filter(a => a.character_id === id);
        deck.forEach(card => {
            const match = ours.find(a => a.name === card.name.toLowerCase());
            if (!match) console.log(`DIFF ${id}: Secretariat "${card.name}" not found`);
            else if (match.initiative !== card.initiative) console.log(`DIFF ${id}: ${match.name} initiative ${match.initiative} vs ${card.initiative}`);
        });
    }
};

const writeAbilities = (abilities) => {
    const clean = abilities.map(({_image, ...rest}) => rest);
    const file = JS + 'games/gh2.json';
    const data = readJson(file);
    data.abilities = clean;
    fs.writeFileSync(file, JSON.stringify(data, null, 4) + '\n');

    const lang = {};
    abilities.forEach(a => lang[abilityCode(a.name)] = {name: a.name});
    const json = JSON.stringify({gh2: lang}, null, 4);
    spliceLang(JS + 'lang/en/abilities.js', '"gh2": {', json.slice(json.indexOf('\n') + 1, json.lastIndexOf('\n')));
};

// Images

const run = (command, args) => execFileSync(command, args, {stdio: 'pipe'});
const exists = fs.existsSync;

const resize = (src, out) => {
    run('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-z', '644', '460', src, '--out', out]);
    run('cwebp', ['-quiet', '-q', '75', out, '-o', out.replace(/\.jpg$/, '.webp')]);
};

const convertImages = (abilities) => {
    for (const [id, , e1, back, matFront, matFile] of CLASSES) {
        const out = `resources/img/abilities/gh2/${id}`;
        fs.mkdirSync(out, {recursive: true});

        const backSrc = back && `${SRC}cards/wordhaven/ability-cards/${id}/${back}.jpeg`;
        if (!exists(`${out}/back.jpg`)) {
            if (backSrc && exists(backSrc)) {
                resize(backSrc, `${out}/back.jpg`);
            } else {
                ['jpg', 'webp'].forEach(ext => fs.copyFileSync(`resources/img/abilities/gh/${e1}/back.${ext}`, `${out}/back.${ext}`));
            }
        }

        abilities.filter(a => a.character_id === id).forEach(a => {
            const target = `${out}/${abilityCode(a.name)}.jpg`;
            if (exists(target)) return;
            const candidates = [a._image, abilityCode(a.name) + '.jpeg'].flatMap(file => [
                `${SRC}cards/abilities/card-browser/${id}/${file}`,
                `${SRC}cards/wordhaven/ability-cards/${id}/${file}`,
            ]);
            const src = candidates.find(exists) || fail(`No image for ${id}/${a.name}`);
            resize(src, target);
        });

        fs.mkdirSync('resources/img/character-mats', {recursive: true});
        const front = matFront ? `${SRC}cards/character-mats/card-browser/${matFront}` : `${SRC}cards/wordhaven/character-mats/front/${matFile}.png`;
        const backMat = `${SRC}cards/wordhaven/character-mats/back/${matFile}.png`;
        [[front, `resources/img/character-mats/${id}-front.jpg`, ['-Z', '1000']], [backMat, `resources/img/character-mats/${id}-back.jpg`, []]].forEach(([src, dest, extra]) => {
            if (exists(dest)) return;
            if (!exists(src)) fail('Missing mat ' + src);
            run('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', ...extra, src, '--out', dest]);
        });
    }
};

// Run

const main = () => {
    const abilities = convertAbilities();
    diffSecretariat(abilities);

    const entries = [];
    const langs = {};
    for (const spec of CLASSES) {
        const converted = convertCharacter(spec, readJson(SECRETARIAT + `character/${spec[1]}.json`));
        entries.push(converted.entry);
        langs[spec[0]] = converted.lang;
        if (converted.lang.perks.length !== converted.entry.perks.length) fail('Perk count mismatch for ' + spec[0]);

        const own = abilities.filter(a => a.character_id === spec[0]);
        const l1 = own.filter(a => a.level === 1).length;
        const x = own.filter(a => a.level === 1.5).length;
        const boxes = converted.entry.perks.reduce((sum, p) => sum + p.count, 0);
        console.log(`${spec[0]} ${converted.entry.name}: perks ${converted.entry.perks.length} (${boxes} boxes), hand ${converted.entry.abilityCount}, L1 ${l1}, X ${x}${l1 === converted.entry.abilityCount && x === 3 ? '' : '  <-- CHECK'}, abilities ${own.length}`);
    }

    writeCharactersJson(entries);
    writeCharactersLang(langs);
    writeAbilities(abilities);
    if (WITH_IMAGES) convertImages(abilities);
};

main();
