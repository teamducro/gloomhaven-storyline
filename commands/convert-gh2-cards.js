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

// Each card: front `C-001.png` -> `1-f` (expand arrow removed); outcome strips `C-001a.png`, `C-001b.png`, ... are stacked into one back `1-b`
// by gh2-event-back.swift, with the overlaps tuned per card in gh2-event-backs.json.
execFileSync('swiftc', ['-O', 'commands/gh2-event-back.swift', '-o', '/tmp/gh2-event-back']);
const backs = JSON.parse(fs.readFileSync('commands/gh2-event-backs.json', 'utf-8'));
const events = {};
for (const [dir, folder] of [['ce', 'city'], ['re', 'road']]) {
    fs.mkdirSync(`${out}/${folder}`, {recursive: true});
    const strips = {};
    for (const file of fs.readdirSync(`${src}/events/${dir}`).sort()) {
        const [, type, number, letter] = file.match(/^([CR])-(\d+)([a-d]?)\.png$/);
        if (letter) {
            (strips[`${type}-${number}`] = strips[`${type}-${number}`] || []).push(letter);
        } else {
            execFileSync('/tmp/gh2-event-back', ['/tmp/gh2-event-back.png', '-', 0, `${src}/events/${dir}/${file}`, '--front']);
            convert('/tmp/gh2-event-back.png', `${out}/${folder}/${parseInt(number)}-f`);
        }
    }
    for (const [name, letters] of Object.entries(strips)) {
        const {joins, bottom, erase, spare} = backs[name];
        const files = letters.map(letter => `${src}/events/${dir}/${name}${letter}.png`);
        const [...tops] = execFileSync('/tmp/gh2-event-back', ['/tmp/gh2-event-back.png', joins.join(',') || '-', bottom, ...files,
            ...(erase ? ['--erase', erase.map(rect => rect.join(',')).join(';')] : []), ...(spare ? ['--spare', spare.join(',')] : [])])
            .toString().trim().split(' ').map(Number);
        const height = tops.pop();
        // An outcome starts where the strip above it ends: the top of its own strip is hidden under that one
        const key = name.replace(/-0*/, '-');
        events[key] = Object.fromEntries(letters.map((letter, i) => [
            letter.toUpperCase(), Math.round((i ? tops[i] + joins[i - 1] : 0) / height * 1000) / 10
        ]));
        convert('/tmp/gh2-event-back.png', `${out}/${folder}/${key.split('-')[1]}-b`);
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
