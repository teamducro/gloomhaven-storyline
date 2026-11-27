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

    it('It redirects to the checkout url of the purchased games', () => {
        utilities.startServer();
        cy.intercept('POST', '**/checkout', {
            body: {session: 'cs_test', url: '/tracker/?payment_success#/campaigns'}
        }).as('checkout');
        cy.visit('/tracker/#/campaigns');

        cy.contains('#campaigns button.mdc-button--raised', 'Buy new shared campaign').click();
        cy.get('.mdc-dialog--open').within(() => {
            cy.contains('label', 'Frosthaven').click();
            cy.contains('button', 'Purchase').click();
        });

        cy.wait('@checkout').its('request.body').should('deep.equal', {games: ['fh']});
        cy.contains('Payment Successful!');
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

        it('It does not offer to keep a deleted shared campaign without progress', () => {
            // Given a shared campaign that was never played on this device
            const shared = {...ownedStory, id: 8, name: 'Gone', is_shared: true, token: 'shared-token'};
            cy.intercept('GET', '**/stories/8', {statusCode: 404, body: {message: 'No query results for model [App\\Models\\Story] 8'}});
            cy.visit('/');
            cy.window().then(win => win.localStorage.setItem('_8', JSON.stringify({})));

            // When its owner deleted it
            visitWithStories({isPatron: false, stories: [shared]});

            // Then only the toast shows
            cy.get('.toast').contains('"Gone" was deleted by its owner');
            cy.get('.mdc-dialog--open').should('not.exist');
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

    describe('Syncing campaigns', () => {
        const remote = {id: 8, name: 'Synced', data: {}, games: ['gh'], expires_at: '2099-01-01', updated_at: '2026-01-01T00:00:00Z'};

        // A shared campaign edited on this device after the server copy: loading it PUTs the local progress.
        function visitWithNewerLocalProgress() {
            utilities.startServer();
            cy.intercept('GET', '**/user', {statusCode: 500});
            cy.intercept('GET', '**/stories', {statusCode: 500});
            cy.intercept('GET', '**/stories/8', {body: remote});
            cy.visit('/');
            cy.window().then((win) => {
                win.localStorage.setItem('token', JSON.stringify('secret'));
                win.localStorage.setItem('user', JSON.stringify({id: 1, name: 'Test', email: 'a@b.c', is_patron: false}));
                win.localStorage.setItem('stories', JSON.stringify([{
                    ...remote, is_shared: true, read_only: false, token: 'shared-token', hash: 'x',
                    updated_at: '2026-06-01T00:00:00Z', data: {sheet: {notes: 'Unsynced notes'}}
                }]));
                win.localStorage.setItem('campaignId', JSON.stringify('_8'));
                win.localStorage.setItem('_8', JSON.stringify({sheet: {notes: 'Unsynced notes'}}));
            });
            cy.visit('/tracker/#/campaigns');
        }

        it('It sends the client version with API requests', () => {
            // Given the API accepts the update
            cy.intercept('PUT', '**/stories/8', {body: {...remote, updated_at: '2026-06-01T00:00:00Z'}}).as('updateStory');

            // When the local progress is synced
            visitWithNewerLocalProgress();

            // Then the request carries the release version
            cy.wait('@updateStory').its('request.headers').then((headers) => {
                expect(headers['x-client-version']).to.match(/^\d+\.\d+\.\d+$/);
                cy.log(`PUT stories/8 X-Client-Version: ${headers['x-client-version']}`);
            });
            cy.screenshot('x-client-version-header', {capture: 'runner'});
        });

        it('It reloads once and then asks to update when the API refuses the outdated version', () => {
            // Given the API refuses this version
            cy.intercept('PUT', '**/stories/8', {statusCode: 426, body: {message: 'Upgrade Required'}}).as('updateStory');
            let loads = 0;
            cy.on('window:load', (win) => win.location.pathname.startsWith('/tracker') && loads++);

            // When the local progress is synced
            visitWithNewerLocalProgress();

            // Then the app reloads for the new build, is refused again and asks to update, keeping the local progress
            cy.wait('@updateStory');
            cy.wait('@updateStory');
            cy.contains('.toast', 'This version of the app is outdated');
            cy.window().then((win) => {
                expect(loads).to.equal(2);
                expect(JSON.parse(win.localStorage.getItem('_8')).sheet.notes).to.equal('Unsynced notes');
                expect(JSON.parse(win.localStorage.getItem('stories'))[0].data.sheet.notes).to.equal('Unsynced notes');
            });
            cy.screenshot('426-reload-then-update-toast', {capture: 'runner'});
        });
    });

    describe('Syncing', () => {
        const story = {id: 1, name: 'Synced', data: {}, expires_at: '2099-01-01'};

        // A cloud campaign on the party page; broadcasts go to win.storyUpdated instead of Pusher.
        function visitCloudCampaign(get = {statusCode: 200, body: story}) {
            cy.intercept('GET', '**/stories/1', get).as('get');
            cy.visit('/tracker/#/party', {
                onBeforeLoad: (win) => {
                    win.localStorage.setItem('campaignId', JSON.stringify('_1'));
                    win.localStorage.setItem('stories', JSON.stringify([story]));
                    win.Echo = {private: () => ({listen: (event, callback) => win.storyUpdated = callback})};
                }
            });
            cy.window().should('have.property', 'storyUpdated');
        }

        const notesOf = (request) => JSON.parse(request.body.data).sheet.notes;

        it('It sends one PUT for several quick edits', () => {
            // Given a cloud campaign
            cy.intercept('PUT', '**/stories/1', {statusCode: 200, body: story}).as('put');
            visitCloudCampaign();

            // When the notes are edited three times in a row
            cy.get('#notes').type('a').blur().type('b').blur().type('c').blur();

            // Then one PUT holds the last state
            cy.wait('@put').then(({request}) => expect(notesOf(request)).to.eq('abc'));
            cy.get('.toast').contains('Progress saved!');
            cy.get('@put.all').should('have.length', 1);
        });

        [423, 429, 500].forEach((status) => {
            it(`It retries a save that failed with ${status}`, () => {
                // Given the server fails the first save
                let puts = 0;
                cy.intercept('PUT', '**/stories/1', (req) => req.reply(puts++ ? {statusCode: 200, body: story} : {statusCode: status, body: {message: 'Busy'}})).as('put');
                visitCloudCampaign();

                // When the notes are edited
                cy.get('#notes').type('Retried').blur();

                // Then the save is sent again and succeeds
                cy.wait('@put').its('response.statusCode').should('eq', status);
                cy.wait('@put').then(({request}) => expect(notesOf(request)).to.eq('Retried'));
                cy.get('.toast').contains('Progress saved!');
            });
        });

        it('It does not retry a forbidden save', () => {
            // Given the server refuses the save
            cy.intercept('PUT', '**/stories/1', {statusCode: 403, body: {message: 'This action is unauthorized.'}}).as('put');
            visitCloudCampaign();

            // When the notes are edited
            cy.get('#notes').type('Refused').blur();

            // Then it is sent once
            cy.wait('@put');
            cy.get('.toast').contains('Failed to save progress');
            cy.wait(3000); // longer than the first retry delay (2 s), to show none follows
            cy.get('@put.all').should('have.length', 1);
        });

        it('It keeps an unsynced edit when another device saves', () => {
            // Given an edit the server failed to save
            cy.intercept('PUT', '**/stories/1', {statusCode: 500, body: {message: 'Error'}}).as('put');
            visitCloudCampaign();
            cy.get('#notes').type('Unsynced').blur();
            cy.wait('@put');

            // When another device saves
            cy.window().then((win) => win.storyUpdated({story: {...story, data: {sheet: {notes: 'Remote'}}}}));

            // Then the edit is pushed again and not overwritten
            cy.wait('@put');
            cy.window().its('app.campaignData.sheet.notes').should('eq', 'Unsynced');
            cy.get('@get.all').should('have.length', 0);
        });

        it('It refetches once for a burst of updates, and once more after a rate limit', () => {
            // Given a cloud campaign whose first refetch is rate limited
            let gets = 0;
            visitCloudCampaign((req) => req.reply(gets++ ? {statusCode: 200, body: story} : {statusCode: 429, body: {}}));

            // When five updates arrive at once
            cy.window().then((win) => [1, 2, 3, 4, 5].forEach(() => win.storyUpdated({})));

            // Then one GET is sent, and after the rate limit one more
            cy.wait('@get').its('response.statusCode').should('eq', 429);
            cy.get('@get.all').should('have.length', 1);
            cy.wait('@get', {timeout: 15000}).its('response.statusCode').should('eq', 200);
        });
    });
});
