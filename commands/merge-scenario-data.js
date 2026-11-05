#!/usr/bin/env node

const fs = require('fs');

// Read the required arguments
const game = process.argv[2];
const inputFileName = process.argv[3];

// Check if the game and input file name are provided
if (!game || !inputFileName) {
    console.error('Usage: npm run merge-scenarios -- <game> <input-file-name>');
    return;
}

// Read the input JSON file
const inputFile = 'resources/js/' + (inputFileName.endsWith('.json') ? inputFileName : inputFileName + '.json')
const inputData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

// Read the game's data file (FC scenarios live in gh.json)
const gameFile = `resources/js/games/${game === 'fc' ? 'gh' : game}.json`;
const gameData = JSON.parse(fs.readFileSync(gameFile, 'utf-8'));

// Set this to true to override existing scenario properties, use with caution.
const overrideProperties = false

function mergeScenarioData(scenarios, input) {
    const scenarioMap = new Map(scenarios.map(scenario => [scenario.id, scenario]));

    input.forEach(inputEntry => {
        const scenario = scenarioMap.get(inputEntry.id);
        // Skip if the scenario doesn't exist
        if (!scenario) {
            return;
        }

        // Merge the input data into the scenario
        Object.entries(inputEntry).forEach(([key, value]) => {
            if (key !== 'id' && (overrideProperties || !scenario.hasOwnProperty(key))) {
                scenario[key] = value;
            }
        })
    });

    return scenarios;
}

// Merge the input data into the scenarios
gameData.scenarios = mergeScenarioData(gameData.scenarios, inputData.scenarios);
const output = JSON.stringify(gameData, null, 4) + '\n'

// Write the output to the game's data file
fs.writeFile(gameFile, output, (err) => {
    if (err) throw err;
});
