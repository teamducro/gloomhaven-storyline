import utilities from "../utilities";

describe('Gloomhaven Secretariat export', () => {

    const exportedGame = () => cy.get('#ghs-download').invoke('attr', 'href').then(
        href => JSON.parse(decodeURIComponent(href.replace('data:application/json;charset=utf-8,', '')))
    );

    const character = (name, title, level, health) => ({
        name, edition: 'gh', title, level, health, maxHealth: health,
        initiative: 0, experience: 0, loot: 0, exhausted: false, off: false, active: false,
        summons: [], entityConditions: [], immunities: [], markers: [], tags: [], lootCards: [], treasures: [],
    });

    const addCragheart = () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();
        cy.get('input[name="name"]').clear().type('Rocky').blur();
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('3{enter}');
    };

    it('It exports the party with class, level and name', () => {
        addCragheart();

        cy.get('#ghs-export-party').click();

        exportedGame().should('deep.equal', {
            revision: 0,
            edition: 'gh',
            figures: ['gh-cragheart'],
            characters: [character('cragheart', 'Rocky', 3, 14)],
            monsters: [],
            sections: [],
            state: 'draw',
            round: 0,
            levelCalculation: true,
            levelAdjustment: 0,
        });
    });

    it('It copies the game to the clipboard', () => {
        addCragheart();
        cy.window().then(win => cy.stub(win.navigator.clipboard, 'writeText').as('writeText'));

        cy.get('#ghs-export-party').click();
        cy.get('#ghs-copy').click();

        exportedGame().then(game => {
            cy.get('@writeText').should('be.calledOnceWithExactly', JSON.stringify(game, null, 2));
        });
    });

    it('It exports the scenario from the scenario modal', () => {
        addCragheart();
        cy.visit('/tracker');

        utilities.openScenario(1);
        cy.get('#ghs-export-scenario').click();

        exportedGame().its('scenario').should('deep.equal', {index: '1', edition: 'gh', isCustom: false, custom: ''});
        exportedGame().its('characters').should('deep.equal', [character('cragheart', 'Rocky', 3, 14)]);
    });

    it('It exports Frosthaven classes with their own edition', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Drifter');
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('9{enter}');

        cy.get('#ghs-export-party').click();

        exportedGame().then(game => {
            expect(game.edition).to.eq('fh');
            expect(game.characters).to.deep.eq([{
                ...character('drifter', 'Drifter', 9, 26),
                edition: 'fh',
            }]);
        });
    });
});
