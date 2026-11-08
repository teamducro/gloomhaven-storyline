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

    it('It submits the campaign code from the url', () => {
        utilities.startServer();
        cy.intercept('POST', '**/login/story-code', {
            statusCode: 422,
            fixture: 'incorrect-code.json'
        }).as('storyCode');

        cy.visit('/tracker/?code=654321abc#/campaigns');

        cy.wait('@storyCode').should((interception) => {
            expect(interception.request.body.code).eq('654321');
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

    describe('Deleting campaigns', () => {
        const ownedStory = {id: 7, name: 'Doomed', data: {}, games: ['gh'], expires_at: '2099-01-01', hash: 'x'};

        function visitWithStories({isPatron, stories, page = 'campaigns', campaignId = 'local'}) {
            utilities.startServer();
            // The state comes from local storage, the sync requests fail like when offline
            cy.intercept('GET', '**/user', {statusCode: 500});
            cy.intercept('GET', '**/stories', {statusCode: 500});
            // Seed from the website page, a still running tracker from the previous test would overwrite the data
            cy.visit('/');
            cy.window().then((win) => {
                win.localStorage.setItem('token', JSON.stringify('secret'));
                win.localStorage.setItem('user', JSON.stringify({id: 1, name: 'Test', email: 'a@b.c', is_patron: isPatron}));
                win.localStorage.setItem('stories', JSON.stringify(stories));
                win.localStorage.setItem('campaignId', JSON.stringify(campaignId));
            });
            cy.visit('/tracker/#/' + page);
        }

        it('It permanently deletes an owned campaign as a patron', () => {
            cy.intercept('DELETE', '**/stories/7', {statusCode: 204, body: ''}).as('deleteStory');
            visitWithStories({isPatron: true, stories: [ownedStory], page: 'settings', campaignId: '_7'});

            cy.get('[data-test=delete-campaign]').click();
            cy.get('.mdc-dialog--open').within(() => {
                cy.contains('Permanently delete "Doomed" for you and everyone it is shared with?');
                cy.contains('this cannot be undone');
                cy.contains('button', 'Confirm').click();
            });

            cy.wait('@deleteStory');
            cy.get('[data-test=delete-campaign]').should('not.exist');
            cy.window().then(win => {
                expect(JSON.parse(win.localStorage.getItem('stories'))).to.deep.equal([]);
                expect(JSON.parse(win.localStorage.getItem('campaignId'))).to.equal('local');
            });
        });

        it('It keeps the campaign when the deletion fails', () => {
            cy.intercept('DELETE', '**/stories/7', {statusCode: 403, body: {message: 'This action is unauthorized.'}}).as('deleteStory');
            visitWithStories({isPatron: true, stories: [ownedStory], page: 'settings', campaignId: '_7'});

            cy.get('[data-test=delete-campaign]').click();
            cy.get('.mdc-dialog--open').contains('button', 'Confirm').click();

            cy.wait('@deleteStory');
            cy.get('.toast').contains('Failed to delete the campaign');
            cy.get('[data-test=delete-campaign]').should('exist');
        });

        it('It does not offer deletion to non patrons', () => {
            visitWithStories({isPatron: false, stories: [ownedStory], page: 'settings', campaignId: '_7'});

            cy.contains('Reset campaign');
            cy.get('[data-test=delete-campaign]').should('not.exist');
        });

        it('It removes a shared campaign that was deleted by its owner', () => {
            const shared = {...ownedStory, id: 8, name: 'Gone', is_shared: true, token: 'shared-token'};
            cy.intercept('GET', '**/stories/8', {statusCode: 404, body: {message: 'No query results for model [App\\Models\\Story] 8'}});
            visitWithStories({isPatron: false, stories: [shared]});

            cy.get('.toast').contains('"Gone" was deleted by its owner');
            cy.contains('li', 'Gone').should('not.exist');
        });

        it('It shows a campaign name in a toast as plain text', () => {
            const shared = {...ownedStory, id: 8, name: '{{ 7 * 191 }} <b>Bold</b>', is_shared: true, token: 'shared-token'};
            cy.intercept('GET', '**/stories/8', {statusCode: 404, body: {message: 'No query results for model [App\\Models\\Story] 8'}});
            visitWithStories({isPatron: false, stories: [shared]});

            cy.get('.toast').contains('"{{ 7 * 191 }} <b>Bold</b>" was deleted by its owner');
            cy.get('.toast b').should('not.exist');
        });

        it('It offers to keep a deleted shared campaign as the local campaign', () => {
            // Given a shared campaign with progress on this device
            const shared = {...ownedStory, id: 8, name: 'Gone', is_shared: true, token: 'shared-token'};
            cy.intercept('GET', '**/stories/8', {statusCode: 404, body: {message: 'No query results for model [App\\Models\\Story] 8'}});
            cy.intercept('PUT', '**/stories/8', {statusCode: 404, body: {message: 'No query results for model [App\\Models\\Story] 8'}});
            utilities.startServer();
            cy.intercept('GET', '**/user', {statusCode: 500});
            cy.intercept('GET', '**/stories', {statusCode: 500});
            cy.visit('/');
            cy.window().then((win) => {
                win.localStorage.setItem('token', JSON.stringify('secret'));
                win.localStorage.setItem('user', JSON.stringify({id: 1, name: 'Test', email: 'a@b.c', is_patron: false}));
                win.localStorage.setItem('stories', JSON.stringify([shared]));
                win.localStorage.setItem('campaignId', JSON.stringify('_8'));
                win.localStorage.setItem('_8', JSON.stringify({sheet: {notes: 'Unsynced notes'}}));
            });

            // When its owner deleted it and the player keeps a copy
            cy.visit('/tracker/#/campaigns');
            cy.get('.mdc-dialog--open').within(() => {
                cy.contains('"Gone" was deleted by its owner');
                cy.contains('Keep a copy as the local campaign');
                cy.contains('button', 'Confirm').click();
            });

            // Then the progress is the local campaign
            cy.window().then(win => {
                expect(win.localStorage.getItem('_8')).to.be.null;
                expect(JSON.parse(win.localStorage.getItem('campaignId'))).to.equal('local');
                expect(JSON.parse(win.localStorage.getItem('local')).sheet.notes).to.equal('Unsynced notes');
            });
        });

        it('It keeps a shared campaign on a 404 that is not about the campaign', () => {
            const shared = {...ownedStory, id: 8, name: 'Kept', is_shared: true, token: 'shared-token'};
            cy.intercept('GET', '**/stories/8', {statusCode: 404, body: {message: 'Not Found'}}).as('findStory');
            visitWithStories({isPatron: false, stories: [shared]});

            cy.wait('@findStory');
            cy.contains('li', 'Kept').should('exist');
            cy.window().then(win => {
                expect(JSON.parse(win.localStorage.getItem('stories'))).to.have.length(1);
            });
        });
    });

});
