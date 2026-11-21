import utilities from "../utilities";

describe('Settings', () => {

    it('It loads the settings page', () => {
        cy.visit('/tracker/#/settings');

        cy.contains('Transfer campaign data');
        cy.contains('Snapshots');
        cy.contains('Translations');
        cy.contains('Font');
        cy.contains('Danger zone!');
    });

    it('It keeps Gloomhaven disabled in another game', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/settings');
        cy.get('#gh-enabled').uncheck();

        cy.reload();
        cy.visit('/tracker/#/characters');
        cy.visit('/tracker/#/settings');

        cy.get('#gh-enabled').should('not.be.checked');
        cy.window().its('app.enabledGames').should('not.include', 'gh');
    });

});
