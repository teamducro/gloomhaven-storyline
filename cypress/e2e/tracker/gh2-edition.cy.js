import utilities from "../utilities";

describe('Gloomhaven edition', () => {

    it('It replaces Gloomhaven with the 2nd edition in the game switch', () => {
        utilities.chooseEdition('gh2');

        cy.window().its('app.game').should('eq', 'gh2');
        cy.get('#gh-enabled').should('be.disabled');
        cy.get('.game-switch li[data-value="gh2"]').should('exist');
        cy.get('.game-switch li[data-value="gh"]').should('not.exist');

        utilities.chooseEdition('gh');

        cy.window().its('app.game').should('eq', 'gh');
        cy.get('.game-switch li[data-value="gh"]').should('exist');
        cy.get('.game-switch li[data-value="gh2"]').should('not.exist');
    });

    it('It offers the edition classes in other games and keeps their unlocks', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/party');
        cy.get('#character-BR').check({force: true});

        utilities.chooseEdition('gh2');
        cy.window().its('app.game').should('eq', 'fh');
        cy.visit('/tracker/#/party');
        cy.get('#character-BR2').should('exist');
        cy.get('#character-BR').should('not.exist');

        utilities.chooseEdition('gh');
        cy.visit('/tracker/#/party');
        cy.get('#character-BR').should('be.checked');
        cy.get('#character-BR2').should('not.exist');
    });

    it('It keeps 1st edition progress when switching editions', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Brute');

        utilities.chooseEdition('gh2');
        cy.window().its('app.game').should('eq', 'gh2');
        cy.window().then((win) => {
            expect(Object.values(win.app.campaignData['sheet-gh2']?.characters || {})).to.have.length(0);
        });

        utilities.chooseEdition('gh');
        cy.window().its('app.game').should('eq', 'gh');
        cy.window().then((win) => {
            // Stored as uuid => class id
            expect(Object.values(win.app.campaignData.sheet.characters)).to.deep.eq(['BR']);
        });
    });

    it('It keeps the edition when the campaign is reset', () => {
        utilities.chooseEdition('gh2');
        cy.get('button').contains('Reset campaign').click();
        cy.get('.mdc-dialog--open button').contains('Clear all').click();

        cy.reload();
        cy.window().its('app.game').should('eq', 'gh2');
    });

    it('It hides both editions when Gloomhaven is turned off', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        utilities.chooseEdition('gh2');
        cy.get('#gh-enabled').uncheck({force: true});

        cy.get('#gloomhaven-edition').should('not.exist');
        cy.get('.game-switch li[data-value="gh"]').should('not.exist');
        cy.get('.game-switch li[data-value="gh2"]').should('not.exist');

        cy.visit('/tracker/#/party');
        cy.get('#character-BR').should('not.exist');
        cy.get('#character-BR2').should('not.exist');

        cy.visit('/tracker/#/settings');
        cy.get('#gh-enabled').check({force: true});
        cy.get('#gloomhaven-edition').should('exist');
        cy.get('.game-switch li[data-value="gh2"]').should('exist');
    });
});
