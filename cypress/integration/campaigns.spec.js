import utilities from "../utilities";

describe('Campaigns', () => {

    it('It loads campaigns', () => {
        cy.visit('/tracker/#/campaigns');

        cy.contains('Campaigns');
    });

    it('It shows a validation message on an incorrect campaign code', () => {
        cy.visit('/tracker/#/campaigns');

        utilities.startServer();
        cy.route({
            method: 'POST',
            url: 'login/story-code',
            status: 422,
            response: 'fixture:incorrect-code.json'
        }).as('storyCode');

        cy.get('#add-shared-campaign').within(() => {
            cy.get('input[name=code]').type('123456');
            cy.get('form').submit();
            cy.wait('@storyCode').should((xhr) => {
                expect(xhr.requestBody.code).eq('123456');
            });
            cy.contains('The provided code is incorrect.');
        });
    });

    it('It shows a validation message on an incorrect email', () => {
        cy.visit('/tracker/#/campaigns');

        utilities.startServer();
        cy.route({
            method: 'POST',
            url: 'mail-login-link',
            status: 422,
            response: 'fixture:incorrect-email.json'
        }).as('mailLoginLink');

        cy.get('#request-login-link').within(() => {
            cy.get('input[name=email]').type('test');
            cy.get('form').submit();
            cy.wait('@mailLoginLink').should((xhr) => {
                expect(xhr.requestBody.email).eq('test');
            });
            cy.contains('The email must be a valid email address.');
        });
    });

    it('It can request a login email', () => {
        cy.visit('/tracker/#/campaigns');

        utilities.startServer();
        cy.route({
            method: 'POST',
            url: 'mail-login-link',
            response: 'fixture:request-login-email.json'
        }).as('mailLoginLink');

        cy.get('#request-login-link').within(() => {
            cy.get('input[name=email]').type('test');
            cy.get('form').submit();
            cy.contains('The email is send to your inbox.');
        });
    });

});
