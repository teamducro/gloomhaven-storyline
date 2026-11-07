import utilities from "../utilities";

describe('Gloomhaven Secretariat export', () => {

    const exportedGame = () => cy.get('#ghs-download').invoke('attr', 'href').then(
        href => JSON.parse(decodeURIComponent(href.replace('data:application/json;charset=utf-8,', '')))
    );

    const character = (name, edition, title, level, health) => ({
        name, edition, title, level, health, maxHealth: health, initiative: 0, experience: 0, loot: 0, summons: [],
    });

    it('It exports the party and scenario', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();
        cy.get('input[name="name"]').clear().type('Rocky').blur();
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('3{enter}');
        cy.visit('/tracker');

        utilities.openScenario(1);
        cy.get('#ghs-export-scenario').click();

        exportedGame().should('deep.equal', {
            revision: 0,
            edition: 'gh',
            characters: [character('cragheart', 'gh', 'Rocky', 3, 14)],
            scenario: {index: '1', edition: 'gh'},
            state: 'draw',
            levelAdjustment: 0,
        });
    });

    it('It exports Frosthaven classes and scenarios with their own edition', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Drifter');
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('9{enter}');
        cy.visit('/tracker');

        utilities.openScenario(1);
        cy.get('#ghs-export-scenario').click();

        exportedGame().then(game => {
            expect(game.edition).to.eq('fh');
            expect(game.characters).to.deep.eq([character('drifter', 'fh', 'Drifter', 9, 26)]);
            expect(game.scenario).to.deep.eq({index: '1', edition: 'fh'});
        });
    });
});
