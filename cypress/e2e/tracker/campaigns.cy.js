import utilities from "../utilities";

describe('Campaigns', () => {

    it('It loads campaigns', () => {
        cy.visit('/tracker/#/campaigns');

        cy.contains('Campaigns');
    });

    it('It shows a validation message on an incorrect campaign code', () => {
        cy.visit('/tracker/#/campaigns');

        utilities.startServer();
        cy.intercept('POST', '**/login/story-code', {
            statusCode: 422,
            fixture: 'incorrect-code.json'
        }).as('storyCode');

        utilities.scrollTo('50%');
        cy.get('#add-shared-campaign').within(() => {
            cy.get('input[name=code]').type('123456', {scrollBehavior: false});
            cy.get('form').submit();
            cy.wait('@storyCode').should((interception) => {
                expect(interception.request.body.code).eq('123456');
            });
            cy.contains('The provided code is incorrect.');
        });
    });

    it('It shows a validation message on an incorrect email', () => {
        cy.visit('/tracker/#/campaigns');

        utilities.startServer();
        cy.intercept('POST', '**/mail-login-link', {
            statusCode: 422,
            fixture: 'incorrect-email.json'
        }).as('mailLoginLink');

        utilities.scrollTo('50%');
        cy.get('#request-login-link').within(() => {
            cy.get('input[name=email]').type('test', {scrollBehavior: false});
            cy.get('form').submit();
            cy.wait('@mailLoginLink').should((interception) => {
                expect(interception.request.body.email).eq('test');
            });
            cy.contains('The email must be a valid email address.');
        });
    });

    it('It can request a login email', () => {
        cy.visit('/tracker/#/campaigns');

        utilities.startServer();
        cy.intercept('POST', '**/mail-login-link', {
            fixture: 'request-login-email.json'
        }).as('mailLoginLink');

        utilities.scrollTo('50%');
        cy.get('#request-login-link').within(() => {
            cy.get('input[name=email]').type('test', {scrollBehavior: false});
            cy.get('form').submit();
            cy.contains('An email has been sent to your inbox.');
        });
    });

    it('It opens the purchase modal directly without owned campaigns', () => {
        cy.visit('/tracker/#/campaigns');

        cy.contains('#campaigns button.mdc-button--raised', 'Buy new shared campaign').click();
        cy.get('.mdc-dialog--open').contains('You are purchasing a new shared campaign license');
    });

    it('It asks to renew an owned campaign or buy a new one', () => {
        cy.visit('/tracker/#/campaigns');
        cy.window().then((win) => {
            win.localStorage.setItem('stories', JSON.stringify([
                {id: 1, name: 'Owned', data: {}, games: ['gh'], expires_at: '2099-01-01'}
            ]));
        });
        cy.reload();

        cy.contains('#campaigns button.mdc-button--raised', 'Buy new shared campaign').click();
        cy.get('.mdc-dialog--open').within(() => {
            cy.contains('Renew an existing campaign or buy a new one?');
            cy.contains('Owned');
            cy.contains('button', 'Extend').click();
        });
        cy.get('.mdc-dialog--open').contains('You are renewing your existing shared campaign license');
        cy.get('.mdc-dialog--open button').contains('Cancel').click();

        cy.contains('#campaigns button.mdc-button--raised', 'Buy new shared campaign').click();
        cy.get('.mdc-dialog--open button').contains('Buy new campaign').click();
        cy.get('.mdc-dialog--open').contains('You are purchasing a new shared campaign license');
    });

});
