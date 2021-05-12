#!/usr/bin/env node

// For now, to run this [ "type": "module" ] needs to be added to package.json

import en from './resources/js/lang/en.js'
import fs from "fs"

// Scan languages directory for language files
fs.readdir('./resources/js/lang/', (err, files) => {
    let otherLanguages = files.filter(file => file.endsWith('js') && file !== 'en.js');

    otherLanguages.forEach(async (file) => {
        // Read language file
        const filePath = './resources/js/lang/' + file;
        let lang = (await import(filePath)).default

        // Find missing keys
        const diff = Object.keys(en).diff(Object.keys(lang))

        let outputObject = {};

        // Replace missing keys from English and preserve order
        Object.keys(en).forEach(key => {
            outputObject[key] = diff.includes(key) ? en[key] : lang[key]
        })

        // Write modified file
        const output = 'export default ' + JSON.stringify(outputObject, null, 4)
        fs.writeFile(filePath, output, (err) => {
            if (err) throw err;
        });
    })
});

// Array diff
Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0
    });
};
