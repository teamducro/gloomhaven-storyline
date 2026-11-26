// Architecture rules, checked on the source and the game data without a build: `npm run test:arch`.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../resources/js');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sources = fs.readdirSync(root, {recursive: true})
    .filter(file => /\.(js|vue)$/.test(file) && !/^(lang|games)\//.test(file));

const games = Object.fromEntries(fs.readdirSync(path.join(root, 'games'))
    .map(file => [path.basename(file, '.json'), JSON.parse(read(`games/${file}`))]));

// Keys each standalone game has data for.
const filled = {
    gh: ['scenarios', 'chapters', 'regions', 'achievements', 'quests', 'personalQuests', 'items', 'abilities', 'characters',
        'characterOrder', 'attackModifierDecks', 'classEvents', 'decks', 'prosperity', 'rules', 'enhancements', 'map'],
    gh2: ['scenarios', 'chapters', 'achievements', 'personalQuests', 'items', 'abilities', 'characters', 'characterOrder',
        'events', 'classEvents', 'decks', 'prosperity', 'rules', 'enhancements', 'sections', 'map'],
    fh: ['scenarios', 'chapters', 'overlays', 'buildings', 'achievements', 'quests', 'personalQuests', 'items', 'abilities',
        'characters', 'characterOrder', 'attackModifierDecks', 'townGuard', 'alchemy', 'decks', 'prosperity', 'shop', 'rules',
        'enhancements', 'map'],
    jotl: ['scenarios', 'chapters', 'quests', 'items', 'abilities', 'characters', 'characterOrder', 'attackModifierDecks',
        'decks', 'prosperity', 'shop', 'rules', 'enhancements', 'map'],
    cs: ['scenarios', 'chapters', 'regions', 'achievements', 'personalQuests', 'items', 'abilities', 'characters',
        'characterOrder', 'classEvents', 'decks', 'prosperity', 'rules', 'enhancements', 'map'],
};

// GH, FC, CS and the packs share one achievement list (see GameData).
const ghFamily = [...games.gh.achievements, ...games.cs.achievements];
const achievements = {gh: ghFamily, fc: ghFamily, cs: ghFamily, mp: ghFamily, cq: ghFamily};
const requirementTokens = ['rope', 'boat', 'sled', 'calendar', 'puzzle'];

// The persisted campaign format: `key()` prefixes and stored field names per Storable model.
// A removed or renamed entry loses the data of existing campaigns, locally and on the server.
const storage = {
    Achievement: {keys: ['achievement-'], fields: ['version', 'hash', 'awarded', 'count', 'lost', 'manual_awarded']},
    AchievementGroup: {keys: ['achievementgroup-'], fields: ['achievements']},
    Building: {keys: ['building-'], fields: ['version', 'hash', 'state', 'level']},
    CampaignSheet: {
        keys: ['campaign-'],
        fields: ['version', 'hash', 'calendar', 'checks', 'perks', 'morale', 'resources', 'soldiers', 'inspiration',
            'totalDefense', 'prosperityIndex', 'summerRoad', 'summerOutpost', 'winterRoad', 'winterOutpost', 'boat', 'notes',
            'deckOrder', 'unlocks', 'scenarioLevel', 'eventHistory', 'itemDesigns', 'crossGameItemsEnabled', 'crossGameItems',
            'removedItems', 'recipes', 'characterUnlocks', 'characters', 'archivedCharacters', 'hidePersonalQuests',
            'enhancementsEnabled', 'enhancements'],
    },
    Character: {
        keys: ['character-'],
        fields: ['uuid', 'id', 'version', 'hash', 'name', 'level', 'xp', 'gold', 'retirements', 'items', 'resources', 'notes',
            'checks', 'masteries', 'perks', 'quest', 'abilities', 'abilityPerLevel', 'milestone', 'sortOrder'],
    },
    Overlay: {keys: ['overlay-'], fields: ['version', 'hash', 'name', 'present']},
    Scenario: {
        keys: ['scenario-'],
        fields: ['version', 'hash', 'state', 'choice', 'promptChoice', 'notes', 'treasures', 'random_item_treasure'],
    },
    Sheet: {
        keys: ['sheet', 'sheet-'],
        fields: ['version', 'hash', 'reputation', 'donations', 'prosperityIndex', 'city', 'road', 'rift', 'notes', 'deckOrder',
            'unlocks', 'scenarioLevel', 'eventHistory', 'factionReputation', 'inspiration', 'imbuement', 'edition', 'itemDesigns',
            'crossGameItemsEnabled', 'crossGameItems', 'removedItems', 'xResult', 'characterUnlocks', 'characters',
            'archivedCharacters', 'hidePersonalQuests', 'enhancementsEnabled', 'enhancements', 'classEventsAdded'],
    },
};

test('every game file has the same top-level keys', () => {
    Object.entries(games).forEach(([game, data]) => {
        assert.deepEqual(Object.keys(data), Object.keys(games.gh), `${game} keys`);
    });
});

test('each standalone game has data where it needs it', () => {
    Object.entries(filled).forEach(([game, keys]) => keys.forEach(key => {
        assert.notEqual(Object.keys(games[game][key]).length, 0, `${game} ${key} is empty`);
    }));
});

test('scenario references resolve', () => {
    const broken = [];

    Object.entries(games).forEach(([game, data]) => {
        const ids = data.scenarios.map(scenario => scenario.id);
        const chapters = data.chapters.map(chapter => chapter.id);
        const known = (achievements[game] || data.achievements).map(achievement => achievement.id);
        const isScenario = id => ids.includes(id);
        const isAchievement = id => known.includes(id);
        const check = (scenario, field, values, isValid) => [].concat(values ?? [])
            .filter(value => !isValid(value))
            .forEach(value => broken.push(`${game} ${scenario.id} ${field}: ${value}`));

        assert.equal(new Set(ids).size, ids.length, `${game} has duplicate scenario ids`);

        data.scenarios.forEach(scenario => {
            ['links_to', 'linked_from', 'coupled', 'treasures_from']
                .forEach(field => check(scenario, field, scenario[field], isScenario));
            // Treasure id → the scenarios it reveals.
            check(scenario, 'treasures_to', Object.values(scenario.treasures_to || {}).flat(), isScenario);
            check(scenario, 'chapter_id', scenario.chapter_id, id => chapters.includes(id));
            ['achievements_awarded', 'achievements_lost']
                .forEach(field => check(scenario, field, scenario[field], isAchievement));
            (scenario.required_by || []).forEach(group => ['complete', 'incomplete'].forEach(state => {
                check(scenario, `required_by.${state}`, group[state], value => typeof value === 'number'
                    ? isScenario(value)
                    : isAchievement(value) || requirementTokens.includes(value));
            }));
        });
    });

    assert.deepEqual(broken, []);
});

test('the persisted campaign format is unchanged', () => {
    const current = Object.fromEntries(Object.keys(storage).map(model => {
        const source = read(`models/${model}.js`);
        const fields = source.match(/this\.fieldsToStore = \{([\s\S]*?)\n {8}\};/)[1];

        return [model, {
            keys: [...source.match(/\n {4}key\(\) \{[\s\S]*?\n {4}\}/)[0].matchAll(/return '([^']*)'/g)].map(match => match[1]),
            fields: [
                ...[...fields.matchAll(/^ {12}"?(\w+)"?:/gm)].map(match => match[1]),
                ...[...source.matchAll(/this\.fieldsToStore\.(\w+) =/g)].map(match => match[1]),
            ],
        }];
    }));

    assert.deepEqual(current, storage, 'Keep reading the old format (or migrate it), then update `storage` in this test');

    const storable = sources.filter(file => file.startsWith('models/') && read(file).includes('this.fieldsToStore ='));
    assert.deepEqual(storable.map(file => path.basename(file, '.js')).sort(), Object.keys(storage).sort());
});

test('only pages and components import pages and components', () => {
    const offenders = sources
        .filter(file => !/^(components|pages)\//.test(file) && file.includes('/'))
        .filter(file => /(from|import\()\s*['"][^'"]*\/(components|pages)\//.test(read(file)));

    assert.deepEqual(offenders, []);
});

test('components subscribe to the bus with $listen', () => {
    const offenders = sources.filter(file => file.endsWith('.vue') && /\$bus\.\$(on|once|off)\(/.test(read(file)));

    assert.deepEqual(offenders, [], '$listen unsubscribes when the component unmounts');
});

test('every bus event has an emitter and a listener', () => {
    const events = pattern => new Set(sources.flatMap(file => [...read(file).matchAll(pattern)].map(match => match[1])));
    const emitted = events(/bus\.\$emit\(\s*'([^']+)'/gi);
    const listened = events(/(?:bus\.\$on|bus\.\$once|\$listen)\(\s*'([^']+)'/gi);

    assert.deepEqual([...emitted].filter(event => !listened.has(event)), [], 'emitted, never listened to');
    assert.deepEqual([...listened].filter(event => !emitted.has(event)), [], 'listened to, never emitted');
});

test('component file names are unique', () => {
    const names = sources.filter(file => file.startsWith('components/') && file.endsWith('.vue')).map(file => path.basename(file));

    assert.deepEqual(names.filter((name, index) => names.indexOf(name) !== index), [], 'components register globally by file name');
});

test('components and pages use global components without importing them', () => {
    // Picked dynamically with `<component :is>`, so they need the import.
    const allowed = ['components/modals/BuildingModal.vue'];
    const offenders = sources
        .filter(file => /^(components|pages)\//.test(file) && !allowed.includes(file))
        .filter(file => /from\s+['"][^'"]*components\/[^'"]+\.vue['"]/.test(read(file)));

    assert.deepEqual(offenders, []);
});

test('every material icon is in the font subset', () => {
    const fonts = fs.readFileSync(path.join(__dirname, '../resources/sass/_fonts.scss'), 'utf8');
    const subset = fonts.match(/icon_names=([\w,]+)/)[1].split(',');
    const used = new Set(sources.flatMap(file => [...read(file).matchAll(/material-icons[^>]*>\s*(\w+)\s*</g)].map(match => match[1])));

    assert.deepEqual([...used].filter(icon => !subset.includes(icon)), [], 'add it to icon_names in _fonts.scss (see the comment there)');
});

// Topic files are plain object literals; `{locale}.js` spreads general and storyline at the top and nests the rest.
const lang = path.join(root, 'lang');
const messages = locale => Object.fromEntries(fs.readdirSync(path.join(lang, locale))
    .filter(file => file !== `${locale}.js`)
    .map(file => [path.basename(file, '.js'),
        new Function(`return ${fs.readFileSync(path.join(lang, locale, file), 'utf8').replace('export default', '')}`)()]));
const flatten = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) => value && typeof value === 'object'
    ? flatten(value, `${prefix}${key}.`)
    : [[`${prefix}${key}`, value]]);

test('every locale has the keys, tokens and plural forms of English', () => {
    const english = Object.fromEntries(flatten(messages('en')));
    const tokens = text => (String(text).match(/\{\w+\}/g) || []).sort().join();
    const broken = [];

    fs.readdirSync(lang).filter(locale => locale !== 'en').forEach(locale => {
        const translated = Object.fromEntries(flatten(messages(locale)));
        const keys = new Set([...Object.keys(english), ...Object.keys(translated)]);

        keys.forEach(key => {
            if (!(key in english) || !(key in translated)) {
                broken.push(`${locale} ${key}: ${key in english ? 'missing' : 'not in English'}`);
            } else if (tokens(english[key]) !== tokens(translated[key])) {
                broken.push(`${locale} ${key}: tokens differ`);
            } else if (String(english[key]).split('|').length !== String(translated[key]).split('|').length) {
                broken.push(`${locale} ${key}: plural forms differ`);
            }
        });
    });

    assert.deepEqual(broken, []);
});

test('every translation key used in the source exists in English', () => {
    const {general, storyline, ...namespaces} = messages('en');
    const english = {...general, ...storyline, ...namespaces};
    // vue-i18n tries the key as a path first, then as a literal.
    const exists = key => key in english || key.split('.').reduce((value, part) => value?.[part], english) !== undefined;
    const used = new Set(sources.flatMap(file => [...read(file).matchAll(/\$t\(\s*'([^'{]+)'\s*[,)]/g)].map(match => match[1])));

    assert.deepEqual([...used].filter(key => !exists(key)), [], 'add the key to lang/en and, in English, to every other locale');
});
