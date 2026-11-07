import gh from "../../../resources/js/games/gh.json";
import gh2 from "../../../resources/js/games/gh2.json";
import fh from "../../../resources/js/games/fh.json";
import jotl from "../../../resources/js/games/jotl.json";
import cs from "../../../resources/js/games/cs.json";
import fc from "../../../resources/js/games/fc.json";
import mp from "../../../resources/js/games/mp.json";
import cq from "../../../resources/js/games/cq.json";
import monsterImages from "../../../resources/js/monster-images.json";

const files = {gh, gh2, fh, jotl, cs, fc, mp, cq};

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

describe('Game data', () => {
    it('Every game file has the same top-level keys', () => {
        cy.visit('/tracker');

        const expected = Object.keys(gh);

        Object.entries(files).forEach(([game, data]) => {
            expect(Object.keys(data), `${game} keys`).to.deep.equal(expected);
        });
    });

    it('Each standalone game has data where it needs it', () => {
        cy.visit('/tracker');

        Object.entries(filled).forEach(([game, keys]) => {
            keys.forEach(key => {
                expect(Object.keys(files[game][key]), `${game} ${key} is not empty`).to.not.be.empty;
            });
        });
    });

    it('Every monster image exists', () => {
        const images = new Set(Object.values(monsterImages).flatMap(game => Object.values(game)));

        images.forEach(image => {
            const thumbnail = image.replace('/', '/thumbs/');
            [image, thumbnail].forEach(path => [path, path.replace(/\.\w+$/, '.webp')].forEach(file => {
                cy.request({method: 'HEAD', url: `/img/monsters/${file}`, log: false});
            }));
        });
    });
});
