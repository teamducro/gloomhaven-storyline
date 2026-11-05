#!/usr/bin/env node

// One-off: converts the GH2e event and personal quest scans in docs/GH 2nd (gitignored) into
// resources/img/cards/gh2/{city,road,quest} (jpg + webp) and writes the events of resources/js/games/gh2.json.
// Requires macOS `sips` and `cwebp` (brew install webp). Run from the repo root: node commands/convert-gh2-cards.js
const fs = require('fs');
const {execFileSync} = require('child_process');

const src = 'docs/GH 2nd/cards/wordhaven';
const out = 'resources/img/cards/gh2';

function convert(from, to) {
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', from, '--out', to + '.jpg'], {stdio: 'ignore'});
    execFileSync('cwebp', ['-quiet', '-q', '80', from, '-o', to + '.webp']);
}

// Each card: front `C-001.png` -> `1-f`, outcome strips `C-001a.png` -> `1-a`, ...
const events = {};
for (const [dir, folder] of [['ce', 'city'], ['re', 'road']]) {
    fs.mkdirSync(`${out}/${folder}`, {recursive: true});
    for (const file of fs.readdirSync(`${src}/events/${dir}`).sort()) {
        const [, type, number, letter] = file.match(/^([CR])-(\d+)([a-d]?)\.png$/);
        const id = parseInt(number);
        const key = `${type}-${id}`;
        events[key] = events[key] || [];
        if (letter) {
            events[key].push(letter.toUpperCase());
        }
        convert(`${src}/events/${dir}/${file}`, `${out}/${folder}/${id}-${letter || 'f'}`);
    }
}
const gameFile = 'resources/js/games/gh2.json';
const game = JSON.parse(fs.readFileSync(gameFile, 'utf-8'));
game.events = events;
fs.writeFileSync(gameFile, JSON.stringify(game, null, 4) + '\n');

fs.mkdirSync(`${out}/quest`, {recursive: true});
for (const file of fs.readdirSync(`${src}/personal-quests`)) {
    const id = parseInt(file.match(/^PQ(\d+)\.png$/)[1]);
    convert(`${src}/personal-quests/${file}`, `${out}/quest/${id}`);
}

console.log(`${Object.keys(events).length} events, ${fs.readdirSync(`${out}/quest`).length / 2} personal quests`);
