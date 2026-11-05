#!/usr/bin/env node

// Converts Gloomhaven Secretariat GH2e items into the items of resources/js/games/gh2.json, lang/*/items.js and img/items/gh2.
// Usage (from the repo root): node commands/convert-gh2-items.js "docs/GH 2nd" [--images]

const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const slugify = require('slugify');

const docs = process.argv[2];
if (!docs) {
    console.error('Usage: node commands/convert-gh2-items.js <path to "docs/GH 2nd"> [--images]');
    process.exit(1);
}
const src = path.join(docs, 'data/gloomhavensecretariat-gh2e');
const read = file => JSON.parse(fs.readFileSync(path.join(src, file), 'utf8'));
const items = read('items.json');
const labels = read('label/spoiler/en.json').items;

// Secretariat class names → our class ids (same as the gh2 characters).
const CLASS = {
    bruiser: 'BR2', tinkerer: 'TI2', spellweaver: 'SW2', 'silent-knife': 'SC2', cragheart: 'CH2', mindthief: 'MT2',
    sun: 'SK2', 'three-spears': 'QM2', circles: 'ST2', eclipse: 'NS2', squidface: 'PH2', lightning: 'BE2',
    'music-note': 'SS2', 'angry-face': 'DS2', saw: 'SB2', triangles: 'EL2', 'two-mini': 'WF2', 'crossed-swords': 'BS2',
};
const SLOT = {legs: 'Legs', body: 'Body', head: 'Head', onehand: 'One Hand', twohand: 'Two Hands', small: 'Small Item'};
const SLOT_ICON = {small: '{SMALL-ITEM}', onehand: '{ONE-HAND}', twohand: '{TWO-HANDS}', legs: '{LEGS}', body: '{BODY}', head: '{HEAD}'};
const ELEMENT = {fire: 'FIRE', ice: 'ICE', air: 'WIND', earth: 'EARTH', light: 'LIGHT', dark: 'DARK', wild: 'ANY'};
const FH_ICONS = ['move', 'attack', 'heal', 'shield', 'range', 'retaliate', 'pierce', 'target', 'push', 'pull', 'jump', 'teleport', 'damage'];
const MODIFIER = {minus1: '{-1_MODIFIER}', plus0: '{+0_MODIFIER}', double: '{2X_MODIFIER}', null: '{NULL_MODIFIER}'};
const CUSTOM = {'gh2e-doom': '{DOOM}', 'gh2e-augment': '{AUGMENT}', 'gh2e-song': '{SONG}', 'gh2e-command': '{COMMAND}', 'gh2e-supplies': 'Supplies'};
const SPECIAL = {self: 'Self', ally: 'One ally', all: 'All', allies: 'All allies'};
const CARD = {round: '{ROUND}', persistent: '{PERSISTENT}'};

// Unlocks Secretariat doesn't model: personal quest gains (official FAQ) and C-86's narrative gain.
const SOURCE_OVERRIDES = {113: 'Personal Quest 15', 137: 'City Event 86', 149: 'Personal Quest 04', 150: 'Personal Quest 17'};
// Reputation items 069-080, requirement printed on the card: Military, Merchant's Guild, Demons at 13/15/17/19.
['Military', "Merchant's Guild", 'Demons'].forEach((faction, f) => [13, 15, 17, 19].forEach((value, v) =>
    SOURCE_OVERRIDES[69 + f * 4 + v] = `${faction} Reputation ${value}`));
// The card prints "Heavy Basinet"; Secretariat spells it "Bassinet".
const NAME_OVERRIDES = {18: 'Heavy Basinet'};
// The card prints "1/21", a misprint Secretariat copied; every other design is a single copy.
const COUNT_OVERRIDES = {112: 1};

// Official FAQ §9.1, item rulings (paraphrased).
const FAQ = {
    12: 'X cards count as level 1 cards, so they can be recovered too.',
    18: 'Only prevents conditions applied by enemies, not self-inflicted ones.',
    29: 'If you are invisible and cannot be targeted, you cannot redirect the attack to yourself.',
    98: 'End of turn looting happens in your original hex, after the teleport.',
    116: 'You cannot use the front side if you already have disadvantage on the attack. The front can be used on an attack an ally grants you, but the card only flips at the end of your next turn.',
    133: 'Instead of attacking you, the enemy performs an Attack -1 on one of your other enemies. Can also be used just to negate the attack.',
    // The FAQ numbers the Flea-Bitten Shawl 136; the card is 137.
    137: 'Does not affect your summons.',
    142: 'You do not take damage from the hazardous terrain you create; it only damages figures that enter it.',
};

const unresolved = new Set();

function token(raw) {
    let m;
    const [key, val] = raw.split(':');
    const signed = key.endsWith('.valueSign');
    const name = key.replace('.valueSign', '');
    const num = val === undefined ? '' : (signed && !val.startsWith('-') ? '+' + val : val);

    if ((m = name.match(/^data\.items\.(gh2e-\d+)\.(\d+)$/))) return text(labels[m[1]][m[2]]);
    if ((m = name.match(/^game\.(?:action\.)?(\w+)$/)) && FH_ICONS.includes(m[1])) {
        const icon = `{${m[1].toUpperCase()}.fh}`;
        return num === '' ? icon : (signed ? `${num} ${icon}` : `${icon} ${num}`);
    }
    if ((m = name.match(/^game\.condition\.(\w+)$/))) return {safeguard: 'Safeguard', plague: 'Plague'}[m[1]] || `{${m[1].toUpperCase()}.fh}`;
    if ((m = name.match(/^game\.element\.consume\.(\w+)$/))) return `{${ELEMENT[m[1]]}_X}`;
    if ((m = name.match(/^game\.element\.(\w+)$/))) return `{${ELEMENT[m[1]]}}`;
    if ((m = name.match(/^game\.attackmodifier\.(\w+)$/))) return MODIFIER[m[1]];
    if ((m = name.match(/^game\.items\.slots\.(\w+)$/))) return SLOT_ICON[m[1]];
    if ((m = name.match(/^data\.action\.custom\.([\w-]+)$/))) return CUSTOM[m[1]];
    if ((m = name.match(/^game\.characterIcon\.([\w-]+)$/))) return `{${CLASS[m[1]]}}`;
    if (/^data\.characterColored\.[\w-]+$/.test(name)) return val;
    if (name === 'game.card.recover') return '{RECOVER.fh}';
    if (name === 'game.card.lost') return '{LOST.fh}';
    if (name === 'game.card.experience') return `${val} XP`;

    unresolved.add(raw);
    return raw;
}

function text(value) {
    return String(value).replace(/<br>/g, ' ').replace(/<\/?i>/g, '').replace(/%([^%]+)%/g, (_, t) => token(t));
}

function action(a) {
    const sub = a.subActions || [];
    let out;
    switch (a.type) {
        case 'custom': out = text(a.value); break;
        case 'condition': out = token('game.condition.' + a.value); break;
        case 'element':
            return a.valueType === 'minus'
                ? `{${ELEMENT[a.value]}_X}: ` + sub.map(action).join(' ')
                : `{${ELEMENT[a.value]}}`;
        case 'specialTarget': return SPECIAL[a.value] || text(a.value);
        case 'card': return CARD[a.value] || a.value;
        // Area shapes are only shown on the card image.
        case 'area': return '';
        case 'concatenation': return sub.map(action).filter(Boolean).join((a.value || '') + ' ');
        case 'loot': out = `{LOOT ${a.value}}`; break;
        default:
            if (!FH_ICONS.includes(a.type)) unresolved.add('action:' + a.type);
            out = `{${a.type.toUpperCase()}.fh}` + (a.value !== undefined ? ' ' + a.value : '');
    }
    const rest = sub.map(action).filter(Boolean);
    return rest.length ? out + ', ' + rest.join(', ') : out;
}

const describe = actions => (actions || []).map(action).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
const titleCase = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

// Unlock sources: scenario/section rewards, treasures, events.
const sources = {};
const addSource = (id, s) => (sources[id] = sources[id] || []).includes(s) || sources[id].push(s);
const walk = (o, cb) => { if (o && typeof o === 'object') { cb(o); Object.values(o).forEach(v => walk(v, cb)); } };
const treasureScenario = {};
for (const dir of ['scenarios', 'sections']) {
    for (const file of fs.readdirSync(path.join(src, dir))) {
        const d = read(dir + '/' + file);
        const scenario = dir === 'scenarios' ? d.index : d.parent;
        walk(d, o => (o.treasures || []).forEach(t => /^\d+$/.test(t) && (treasureScenario[t] = treasureScenario[t] || new Set()).add(+scenario)));
        // "37-2" means two copies of item 37.
        ((d.rewards && d.rewards.items) || []).map(id => parseInt(id, 10)).forEach(id => addSource(id, d.group === 'solo'
            ? `Reward from Solo Scenario - {${CLASS[items.find(i => i.id === id).solo]}}`
            : `Reward from {SCENARIO ${+scenario}}`));
    }
}
read('treasures.json').forEach((reward, i) => (reward.match(/item:(\d+)/g) || []).forEach(m => {
    const scenarios = [...(treasureScenario[i + 1] || [])].map(s => `{SCENARIO ${s}} `).join('');
    addSource(+m.slice(5), scenarios + `(Treasure #${String(i + 1).padStart(2, '0')})`);
}));
read('events.json').forEach(e => walk(e, o => o.type === 'item' && (o.values || []).forEach(id =>
    addSource(+id, `${e.type === 'city' ? 'City' : 'Road'} Event ${e.cardId.replace(/^\w-0*/, '')}`))));

const output = items.map(i => {
    const source = [];
    if (i.unlockProsperity) source.push('Prosperity ' + i.unlockProsperity);
    if (i.random) source.push('Random Item');
    source.push(...(sources[i.id] || []));
    if (SOURCE_OVERRIDES[i.id]) source.push(SOURCE_OVERRIDES[i.id]);

    const item = {id: i.id, name: NAME_OVERRIDES[i.id] || i.name, count: COUNT_OVERRIDES[i.id] || i.count, cost: i.cost, slot: SLOT[i.slot]};
    if (source.length) item.source = source.join('\n');
    if (i.spent) item.spent = true;
    if (i.consumed) item.consumed = true;
    if (i.minusOne) item.minusOneCardsAdded = i.minusOne;
    item.desc = i.summon ? 'Summon ' + titleCase(i.summon.name) : describe(i.actions);
    if (i.actionsBack) item.backDesc = describe(i.actionsBack);
    if (FAQ[i.id]) item.faq = FAQ[i.id];
    return item;
});

if (unresolved.size) throw new Error('Unresolved tokens: ' + [...unresolved].join(', '));
if (output.length !== 170) throw new Error('Expected 170 items, got ' + output.length);
const gameFile = 'resources/js/games/gh2.json';
const game = JSON.parse(fs.readFileSync(gameFile, 'utf8'));
game.items = output;
fs.writeFileSync(gameFile, JSON.stringify(game, null, 4) + '\n');

// Translations: English text everywhere, item names reused from existing translations with the same English name.
const langDir = 'resources/js/lang';
const loadLang = file => new Function('return ' + fs.readFileSync(file, 'utf8').replace(/^export default /, ''))();
const en = loadLang(`${langDir}/en/items.js`);
const keyByName = {};
Object.entries(en).forEach(([key, value]) => keyByName[value.name] = keyByName[value.name] || key);

for (const locale of fs.readdirSync(langDir).filter(dir => fs.existsSync(`${langDir}/${dir}/items.js`))) {
    const file = `${langDir}/${locale}/items.js`;
    const lang = loadLang(file);
    output.forEach(item => {
        const existing = lang[keyByName[item.name]];
        lang['gh2-' + item.id] = {
            name: existing ? existing.name : item.name,
            ...(item.source && {source: item.source}),
            desc: item.desc,
            ...(item.backDesc && {backDesc: item.backDesc}),
            ...(item.faq && {faq: item.faq}),
        };
    });
    fs.writeFileSync(file, 'export default ' + JSON.stringify(lang, null, 4));
}

// Images: Worldhaven 2e scans (Secretariat's artwork is 1e), resized to 400x600 like the other games.
if (process.argv.includes('--images')) {
    const from = path.join(docs, 'cards/wordhaven/items');
    const to = 'resources/img/items/gh2';
    fs.mkdirSync(to, {recursive: true});
    const convert = (png, name) => {
        execFileSync('sips', ['-z', '600', '400', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', png, '--out', `${to}/${name}.jpg`], {stdio: 'ignore'});
        execFileSync('cwebp', ['-quiet', '-q', '80', '-resize', '400', '600', png, '-o', `${to}/${name}.webp`]);
    };
    output.forEach(item => {
        const code = slugify(item.name.replaceAll("'", ''), {lower: true});
        const pad = String(item.id).padStart(3, '0');
        convert(path.join(from, pad + '.png'), code);
        if (item.backDesc) {
            // Worldhaven names most backs 054b.png, but 74b.png and 80b.png are unpadded.
            const back = [pad + 'b.png', item.id + 'b.png'].map(f => path.join(from, f)).find(f => fs.existsSync(f));
            if (!back) throw new Error('Missing back image for item ' + item.id);
            convert(back, code + '-back');
        }
    });
}

console.log(`Converted ${output.length} items.`);
