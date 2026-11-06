#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Gloomhaven Secretariat data dir (github.com/Lurkars/gloomhavensecretariat) and the game file to fill
const [game, secretariatDataDir] = process.argv.slice(2);
// Our game id => Secretariat edition directory per scenario.game
const editions = {gh: 'gh', fc: 'fc', gh2: 'gh2e', fh: 'fh', jotl: 'jotl'};

if (!game || !secretariatDataDir) {
    console.error('Usage: node commands/import-scenario-monsters.js <game> <path-to-secretariat/data>');
    process.exit(1);
}

// Base monster names; Secretariat also lists scenario/solo variants ("city-guard-sun-solo") and stat tweaks ("living-bones:-1")
const baseMonsters = new Set();
fs.readdirSync(secretariatDataDir).forEach(edition => {
    const dir = path.join(secretariatDataDir, edition, 'monster');
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).filter(f => f.endsWith('.json') && !/solo|scenario/.test(f))
            .forEach(f => baseMonsters.add(f.replace('.json', '')));
    }
});

function baseMonster(name) {
    name = name.split(':')[0];
    while (name && !baseMonsters.has(name)) {
        name = name.includes('-') ? name.slice(0, name.lastIndexOf('-')) : '';
    }
    return name;
}

const gameFile = `resources/js/games/${game}.json`;
const gameData = JSON.parse(fs.readFileSync(gameFile, 'utf-8'));

const monstersByEdition = {};
function monstersFor(edition, index) {
    if (!monstersByEdition[edition]) {
        monstersByEdition[edition] = {};
        const dir = path.join(secretariatDataDir, edition, 'scenarios');
        fs.readdirSync(dir).filter(f => f.endsWith('.json')).forEach(file => {
            const scenario = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
            monstersByEdition[edition][String(scenario.index)] = scenario.monsters;
        });
    }
    return monstersByEdition[edition][String(index)];
}

gameData.scenarios.forEach(scenario => {
    const edition = editions[scenario.game];
    const monsters = edition && !scenario.solo && monstersFor(edition, scenario.number || scenario.id);
    if (!monsters || !monsters.length) {
        console.warn(`No monsters for ${scenario.game} ${scenario.number || scenario.id}`);
        return;
    }
    scenario.monsters = [...new Set(monsters.map(baseMonster))].sort();
});

fs.writeFileSync(gameFile, JSON.stringify(gameData, null, 4) + '\n');
