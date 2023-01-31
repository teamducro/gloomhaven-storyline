#!/usr/bin/env node

// For now, to run this [ "type": "module" ] needs to be added to package.json

import fs from "fs"
import characters from "./resources/js/characters.json" assert {type: "json"};

// Default attack modifier deck
let decks = {
    base: [
        "plus0",
        "plus1",
        "plus2",
        "minus1",
        "minus2",
        "times2",
        "mis"
    ]
};

// Read perks per character
for (const [id, character] of Object.entries(characters.characters)) {
    let perkCards = [];

    // Generate unique codes for each perk card
    character.perks.forEach(perk => {
        perk.cards?.forEach(card => {
            const code = generateCode(card.attackModifier);
            if (!decks.base.includes(code)) {
                perkCards.push(code);
            }
        })
    })

    if (perkCards.length) {
        // Unique
        decks[id] = [...new Set(perkCards)];
    }
}

// Write json to file
const output = JSON.stringify(decks, null, 4)
const filePath = './resources/js/attack-modifier-decks.json'
fs.writeFile(filePath, output, (err) => {
    if (err) throw err;
});

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
