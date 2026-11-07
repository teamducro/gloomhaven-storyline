#!/usr/bin/env node

// Imports which monsters appear in each scenario from Gloomhaven Secretariat (GHS) into games/{game}.json.
// Usage: npm run monsters [-- --dry-run]

const fs = require('fs');
const os = require('os');
const path = require('path');

const GHS_SHA = 'ff48a9948b0fd19f56e60816b13142074d1d9704';
const RAW = `https://raw.githubusercontent.com/Lurkars/gloomhavensecretariat/${GHS_SHA}/data`;
const API = 'https://api.github.com/repos/Lurkars/gloomhavensecretariat/contents/data';
const CACHE = path.join(os.tmpdir(), 'ghs-' + GHS_SHA);
const dryRun = process.argv.includes('--dry-run');

// Our game (as in scenario.game) => GHS edition folder
const EDITIONS = {gh: 'gh', fc: 'fc', gh2: 'gh2e', fh: 'fh', jotl: 'jotl', cs: 'cs', mp: 'mp'};
// Game => data file (FC scenarios live in gh.json)
const FILES = {gh: 'gh', fc: 'gh', gh2: 'gh2', fh: 'fh', jotl: 'jotl', cs: 'cs', mp: 'mp'};

async function cached(url, file) {
    const cachePath = path.join(CACHE, file);
    if (fs.existsSync(cachePath)) {
        return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${response.status} ${url}`);
    }
    const json = await response.json();
    fs.mkdirSync(path.dirname(cachePath), {recursive: true});
    fs.writeFileSync(cachePath, JSON.stringify(json));
    return json;
}

async function folder(edition, type) {
    const list = await cached(`${API}/${edition}/${type}?ref=${GHS_SHA}`, `${edition}/${type}.list.json`)
        // Not every edition has a sections folder
        .catch(error => error.message.startsWith('404') ? [] : Promise.reject(error));
    return Promise.all(list
        .filter(file => file.name.endsWith('.json'))
        .map(file => cached(`${RAW}/${edition}/${type}/${file.name}`, `${edition}/${type}/${file.name}`)));
}

const normalizeName = name => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function matchScenario(ghs, ours) {
    const byName = ours.find(scenario => normalizeName(scenario.name) === normalizeName(ghs.name));
    if (byName) {
        return byName;
    }

    // "004A"/"004B" are two halves of our scenario 4, "32a" => 32, "01" => 1. GHS solo indexes are a separate
    // numbering, except in CS where solo scenarios share our ids (and some have a different title).
    const index = ghs.index.replace(/^0+(?=\d)/, '').replace(/^(\d+)[AaBb]$/, '$1');
    return ours.find(scenario => String(scenario.id) === index && !scenario.solo === !ghs.solo) || null;
}

async function main() {
    const labels = {};
    const result = {}; // file => id => Set of slugs
    const report = [];

    // GH solo scenario 18 (Envelope X) only exists in the shared solo folder
    const soloScenarios = await folder('solo', 'scenarios');

    for (const [game, edition] of Object.entries(EDITIONS)) {
        const file = FILES[game];
        const data = JSON.parse(fs.readFileSync(`resources/js/games/${file}.json`, 'utf-8'));
        const ours = data.scenarios.filter(scenario => (scenario.game || file) === game);
        const label = await cached(`${RAW}/${edition}/label/en.json`, `${edition}/label/en.json`);
        Object.assign(labels, label.monster || {});

        const scenarios = await folder(edition, 'scenarios');
        soloScenarios
            .filter(solo => solo.edition === edition && !scenarios.some(s => s.name === solo.name))
            .forEach(solo => scenarios.push(solo));
        const sections = await folder(edition, 'sections');

        const matched = new Map(); // GHS index => our scenario
        result[file] = result[file] || {};
        scenarios.forEach(ghs => {
            const scenario = matchScenario(ghs, ours);
            if (!scenario) {
                report.push(`${game}: no match for GHS ${ghs.index} "${ghs.name}"`);
                return;
            }
            matched.set(ghs.index, scenario);
            const monsters = result[file][scenario.id] = result[file][scenario.id] || new Set();
            monstersOf(ghs).forEach(monster => monsters.add(monster));
        });
        sections.forEach(section => {
            const scenario = matched.get(section.parent);
            if (scenario) {
                monstersOf(section).forEach(monster => result[file][scenario.id].add(monster));
            }
        });

        ours.filter(scenario => !result[file][scenario.id])
            .forEach(scenario => report.push(`${game}: no GHS match for ${scenario.id} "${scenario.name}"`));
    }

    // Fold variants ("bandit-guard-hired-muscle", "inox-bodyguard-scenario-32", "ghost-viper-extra") into their base
    // monster, so filtering on "Bandit Guard" also finds them.
    const isClean = slug => labels[slug] && !/[%(]|^Extra /.test(labels[slug]);
    const base = slug => {
        if (isClean(slug) && !/-(scenario|section)-|-\d|-(cs|solo)$/.test(slug)) {
            return slug;
        }
        const parts = slug.split('-');
        for (let length = parts.length - 1; length > 0; length--) {
            const prefix = parts.slice(0, length).join('-');
            if (isClean(prefix)) {
                return prefix;
            }
        }
        return slug;
    };

    const names = {};
    for (const [file, scenarios] of Object.entries(result)) {
        const gameFile = `resources/js/games/${file}.json`;
        const data = JSON.parse(fs.readFileSync(gameFile, 'utf-8'));
        data.scenarios.forEach(scenario => {
            if (!scenarios[scenario.id]) {
                return;
            }
            const monsters = [...new Set([...scenarios[scenario.id]].map(base))];
            if (scenario.monsters && JSON.stringify(scenario.monsters) !== JSON.stringify(monsters)) {
                report.push(`${file} ${scenario.id}: [${scenario.monsters}] => [${monsters}]`);
            }
            scenario.monsters = monsters;
            monsters.forEach(monster => names[monster] = labels[monster]);
        });
        if (!dryRun) {
            fs.writeFileSync(gameFile, JSON.stringify(data, null, 4) + '\n');
        }
    }

    Object.entries(names)
        .filter(([, name]) => !name || name.includes('%'))
        .forEach(([slug, name]) => report.push(`no display name for ${slug}: ${name}`));

    const sorted = Object.fromEntries(Object.entries(names).sort(([a], [b]) => a.localeCompare(b)));
    if (!dryRun) {
        fs.writeFileSync('resources/js/lang/en/monsters.js', 'export default ' + JSON.stringify(sorted, null, 4) + '\n');
    }

    console.log(report.join('\n'));
    console.log(`${Object.keys(sorted).length} monsters`);
}

// Allies are listed in both "monsters" and "allies"; "bandit-archer:-1" carries a level modifier
function monstersOf(ghs) {
    const allies = ghs.allies || [];
    return (ghs.monsters || [])
        .map(monster => monster.split(':')[0])
        .filter(monster => !allies.includes(monster));
}

main().catch(error => {
    console.error(error.message);
    process.exit(1);
});
