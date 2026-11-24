// Every image in resources/img is on the CDN (`npm run cdn` is a manual step): `CDN_URL=https://... npm run test:cdn`.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const cdnUrl = process.env.CDN_URL;
const root = path.join(__dirname, '../resources');
const files = fs.readdirSync(path.join(root, 'img'), {recursive: true})
    .map(file => `img/${file}`)
    .filter(file => !path.basename(file).startsWith('.') && fs.statSync(path.join(root, file)).isFile());

test('Every image is on the CDN', {skip: !cdnUrl && 'CDN_URL not set'}, async () => {
    const missing = [];
    const queue = [...files];
    // The browser encodes these paths the same way, so a file with spaces or umlauts is checked as it's loaded.
    const check = async file => {
        const response = await fetch(`${cdnUrl}/${encodeURI(file)}`, {method: 'HEAD'});
        if (!response.ok) missing.push(`${response.status} ${file}`);
    };
    await Promise.all(Array.from({length: 32}, async () => {
        while (queue.length) await check(queue.shift());
    }));

    assert.deepEqual(missing.sort(), [], `${missing.length} of ${files.length} images missing, run \`npm run cdn\``);
});
