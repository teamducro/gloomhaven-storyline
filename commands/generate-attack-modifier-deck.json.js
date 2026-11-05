#!/usr/bin/env node

// For now, to run this [ "type": "module" ] needs to be added to package.json

import fs from "fs"
const games = ['gh', 'fc', 'jotl', 'cs', 'fh', 'mp', 'gh2'];
const baseDeck = [
    "plus0",
    "plus1",
    "plus2",
    "minus1",
    "minus2",
    "times2",
    "mis"
];

for (const game of games) {
    const filePath = new URL(`../resources/js/games/${game}.json`, import.meta.url);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const decks = {};
    if (game === 'gh') decks.base = baseDeck;

    // Read perks per character
    for (const [id, character] of Object.entries(data.characters)) {
        if (!fs.existsSync(new URL('../resources/img/attack-modifiers/' + id.toLowerCase(), import.meta.url))) continue; // No images (gh2): ModifierDeck shows text cards
        let perkCards = [];

        // Generate unique codes for each perk card
        character.perks.forEach(perk => {
            perk.cards?.forEach(card => {
                const code = generateCode(card.attackModifier);
                if (!baseDeck.includes(code)) {
                    perkCards.push(code);
                }
            })
        })

        if (perkCards.length) {
            // Unique
            decks[id] = [...new Set(perkCards)];
        }
    }

    // Keep entries that are not class decks (e.g. the FH town guard)
    for (const [key, deck] of Object.entries(data.attackModifierDecks)) {
        if (key !== 'base' && !(key in data.characters)) decks[key] = deck;
    }

    data.attackModifierDecks = decks;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n');
}

// Generate a code for a given attack modifier
function generateCode(card) {
    let code = card.type;
    card.effects?.forEach(effect => {
        if (['element', 'condition'].includes(effect.type)) {
            code += '_' + effect.value;
        } else {
            code += '_' + effect.type + effect.value;
        }
    })

    if (card.rolling) {
        code += '_rolling';
    }

    return code;
}
