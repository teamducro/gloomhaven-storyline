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

    it('It restores a local campaign from its backup link', () => {
        // Given a local campaign with a note, backed up
        cy.visit('/tracker/#/party');
        cy.get('#notes').type('Backup note').blur();
        cy.visit('/tracker/#/settings');
        cy.get('[data-test="backup-link"]').invoke('val').as('link', {type: 'static'});

        // When the campaign is changed and the backup is restored
        cy.visit('/tracker/#/party');
        cy.get('#notes').clear().type('Changed note').blur();
        cy.visit('/tracker/#/settings');
        cy.get('@link').then(link => cy.get('[data-test="restore-link"]').type(link, {delay: 0}));
        cy.get('[data-test="restore-backup"]').click();
        cy.get('.mdc-dialog--open').contains('Confirm').click();

        // Then the backed up campaign is back
        cy.url().should('include', '#/story');
        cy.window().its('app.campaignData.sheet.notes').should('equal', 'Backup note');
    });

    it('It keeps the local campaign when the backup link is invalid', () => {
        // Given a local campaign with a note
        cy.visit('/tracker/#/party');
        cy.get('#notes').type('Kept note').blur();
        cy.visit('/tracker/#/settings');

        // When an invalid link is restored
        cy.get('[data-test="restore-link"]').type('https://example.com/not-a-backup');
        cy.get('[data-test="restore-backup"]').click();

        // Then nothing is replaced
        cy.get('.toast').contains('This is not a valid backup link.');
        cy.window().its('app.campaignData.sheet.notes').should('equal', 'Kept note');
    });

});
