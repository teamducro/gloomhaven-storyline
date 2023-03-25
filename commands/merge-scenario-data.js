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

// Read the scenarios JSON file
let scenarioFile = 'resources/js/scenarios.json';
if (game !== 'gh' && game !== 'fc') {
    scenarioFile = scenarioFile.replace('.json', `-${game}.json`);
}
const scenarioData = JSON.parse(fs.readFileSync(scenarioFile, 'utf-8'));

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
scenarioData.scenarios = mergeScenarioData(scenarioData.scenarios, inputData.scenarios);
const output = JSON.stringify(scenarioData, null, 4)

// Write the output to the scenarios JSON file
fs.writeFile(scenarioFile, output, (err) => {
    if (err) throw err;
});
