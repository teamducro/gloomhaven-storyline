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

});
