#!/usr/bin/env node

// For now, to run this [ "type": "module" ] needs to be added to package.json

import fs from "fs"

// Scan languages directory for language files
const folders = fs.readdirSync('./resources/js/lang/');
const otherLanguages = folders.filter(dir => dir.length === 2 && dir !== 'en');

const files = fs.readdirSync('./resources/js/lang/en/');
const languageFiles = files.filter(file => file.endsWith('js') && file !== 'en.js');

otherLanguages.forEach((dir) => {
    console.log('--- ' + dir.toUpperCase() + ' ---');
    languageFiles.forEach(async (file) => {
        console.log(file);

        // Read english language file
        const enPath = './resources/js/lang/en/' + file
        let en = (await import(enPath)).default

        // Read language file
        const filePath = './resources/js/lang/' + dir + '/' + file
        let lang = (await import(filePath)).default

        if (lang === undefined) {
            lang = {}
        }

        let outputObject = {};

        // Find missing keys
        const diff = Object.keys(en).diff(Object.keys(lang))

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
