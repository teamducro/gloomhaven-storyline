import monsterImages from "../../../resources/js/monster-images.json";

describe('Game data', () => {
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
