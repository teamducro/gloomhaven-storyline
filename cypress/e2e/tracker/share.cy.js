import utilities from "../utilities";

describe('Share', () => {

    it('It can share with new link format', () => {
        // Straight to the tracker: the website redirect is covered by the next test, and slows a cold start past the timeout.
        utilities.visitShared('/tracker/#/shared/1/local/N4RozgjARAXKYBcQGMC+AaEBDA5gYQCVZQswBtKAcUIFkoBdDbaguubAdxAk2QHseIADYgADEywAFAGIBlYp268BmEeMxgATAsQomYAMw6kAS30AWYyDOogA');

        utilities.isNodeVisible(1);
        utilities.isNodeVisible(2);
        utilities.isNodeIncomplete(3);
        utilities.isNodeIncomplete(4);
    });

    it('It redirects to the correct page after sharing', () => {
        cy.visit('#/shared/1/local/N4RozgjARAXKYBcQGMC+AaEBDA5gYQCVZQswBtKAcUIFkoBdDbaguubAdxAk2QHseIADYgADEywAFAGIBlYp268BmEeMxgATAsQomYAMw6kAS30AWYyDOogA/items');

        cy.url().should('include', '/items');
        cy.get('#items').contains('Boots of Striding');
    });

    it('It shares the party sheet', () => {
        utilities.visitShared('/tracker/#/shared/1/local/N4RozgjARAXKDGALAdgVwDboDQmVKOADvGpjmAC4gCWOFA2gLoC+OAhgOYDCASrKGzD0oAcV4BZKC3ZiekuCDYB3EBBzwA9mpDoQABlbhECRG3qqc2q5Zv6ce+47vOHLp672McAEwh7-ONTewFAA7NAwdmEATLBRoQDMcQ5hACzJWGEArBlhAGy5oaGFAByFAJy5JXpVEVElsZEpJUlNmSXpbVAlOV0lBX3FfWV9lV3lNeN1KeWNUeWt853zvfqGeABiGhoABABCbABOBCCE1HlZOIfRrqjmHu6PLizMQA/party');

        cy.get('input[aria-labelledby="reputation"]').should('have.value', '20');
        cy.get('input[aria-labelledby="donations"]').should('have.value', '1000');
        cy.get('input#p-35').should('be.checked');
        cy.get('input#p-65').should('be.checked');
        cy.get('span').contains('064–070').prev().find('input').should('be.checked');
        cy.get('#notes').should('have.value', 'Foo Bar');
    });

    it('It shows an error message on invalid version', () => {
        let alerted = false;
        cy.on('window:alert', message => alerted = message);

        cy.visit('#/shared/9999/local/N4RozgjARAXKYBcQGMC+AaEBDA5gYQCVZQswBtKAcUIFkoBdDbaguubAdxAk2QHseIADYgADEywAFAGIBlYp268BmEeMxgATAsQomYAMw6kAS30AWYyDOogA');

        cy.get('.toast').contains('incompatible').should('exist');
    });

    it('It shows an error message on failed storage id', () => {
        let alerted = false;
        cy.on('window:alert', message => alerted = message);

        cy.visit('#/shared/1/invalid/N4RozgjARAXKYBcQGMC+AaEBDA5gYQCVZQswBtKAcUIFkoBdDbaguubAdxAk2QHseIADYgADEywAFAGIBlYp268BmEeMxgATAsQomYAMw6kAS30AWYyDOogA');

        cy.get('.toast').contains('incompatible').should('exist');
    });

    it('It shows an error message when decoding failed', () => {
        let alerted = false;
        cy.on('window:alert', message => alerted = message);

        cy.visit('#/shared/1/local/N4RozgjARAXKYBcQGMC+AaEBDA5gYQCVZQswBtKAcUIFkoBdDbaguubAdxAk2QHseI');

        cy.get('.toast').contains('incompatible').should('exist');
    });

    describe('With progress in the local campaign', () => {
        beforeEach(() => {
            cy.visit('/tracker/#/story');
            cy.window().then(win => win.localStorage.setItem('local', JSON.stringify({sheet: {notes: 'My campaign'}})));
            cy.reload();
        });

        it('It asks before it replaces the campaign', () => {
            // When a shared link is opened
            cy.visit('/tracker/#/shared/1/local/N4RozgjARAXKDGALAdgVwDboDQmVKOADvGpjmAC4gCWOFA2gLoC+OAhgOYDCASrKGzD0oAcV4BZKC3ZiekuCDYB3EBBzwA9mpDoQABlbhECRG3qqc2q5Zv6ce+47vOHLp672McAEwh7-ONTewFAA7NAwdmEATLBRoQDMcQ5hACzJWGEArBlhAGy5oaGFAByFAJy5JXpVEVElsZEpJUlNmSXpbVAlOV0lBX3FfWV9lV3lNeN1KeWNUeWt853zvfqGeABiGhoABABCbABOBCCE1HlZOIfRrqjmHu6PLizMQA/party');

            // Then the campaign is only replaced after confirming
            cy.get('[data-test="shared-confirm"]').contains('Replace local campaign?');
            cy.window().its('app.campaignData.sheet.notes').should('equal', 'My campaign');
            cy.get('[data-test="shared-replace"]').click();
            cy.url().should('include', '#/party');
            cy.get('#notes').should('have.value', 'Foo Bar');
        });

        it('It keeps the campaign when cancelled', () => {
            // When a shared link is opened and cancelled
            cy.visit('/tracker/#/shared/1/local/N4RozgjARAXKDGALAdgVwDboDQmVKOADvGpjmAC4gCWOFA2gLoC+OAhgOYDCASrKGzD0oAcV4BZKC3ZiekuCDYB3EBBzwA9mpDoQABlbhECRG3qqc2q5Zv6ce+47vOHLp672McAEwh7-ONTewFAA7NAwdmEATLBRoQDMcQ5hACzJWGEArBlhAGy5oaGFAByFAJy5JXpVEVElsZEpJUlNmSXpbVAlOV0lBX3FfWV9lV3lNeN1KeWNUeWt853zvfqGeABiGhoABABCbABOBCCE1HlZOIfRrqjmHu6PLizMQA/party');
            cy.get('[data-test="shared-cancel"]').click();

            // Then the campaign is unchanged
            cy.url().should('include', '#/party');
            cy.get('#notes').should('have.value', 'My campaign');
            cy.window().then(win => expect(JSON.parse(win.localStorage.getItem('local')).sheet.notes).to.equal('My campaign'));
        });
    });

});
