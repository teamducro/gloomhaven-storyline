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
        cy.get('[data-test="shared-replace"]').click();

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

    it('It reloads a cloud campaign from the server', () => {
        // Given a synced campaign whose local copy differs from the server's
        const story = {id: 9, name: 'Synced', games: ['gh'], expires_at: '2099-01-01', hash: 'x', updated_at: '2020-01-01T00:00:00Z'};
        const serverData = {sheet: {reputation: 7}};
        const putReputations = [];
        utilities.startServer();
        cy.intercept('GET', '**/user', {statusCode: 500});
        cy.intercept('GET', '**/stories', {statusCode: 500});
        cy.intercept('GET', '**/stories/9', {statusCode: 200, body: {...story, data: serverData}}).as('getStory');
        cy.intercept('PUT', '**/stories/9', (req) => {
            putReputations.push(JSON.parse(req.body.data).sheet?.reputation);
            req.reply({statusCode: 500});
        }).as('put');
        cy.visit('/');
        cy.window().then((win) => {
            win.localStorage.setItem('token', JSON.stringify('secret'));
            win.localStorage.setItem('user', JSON.stringify({id: 1, name: 'Test', email: 'a@b.c'}));
            // Newer than the server's, which a normal fetch would push first
            win.localStorage.setItem('stories', JSON.stringify([{...story, data: {}, updated_at: '2030-01-01T00:00:00Z'}]));
            win.localStorage.setItem('campaignId', JSON.stringify('_9'));
            win.localStorage.setItem('_9', JSON.stringify({sheet: {reputation: 3}}));
        });
        cy.visit('/tracker/#/settings');
        cy.window().its('app.campaignData.sheet.reputation').should('eq', 3);
        // The start-up sync pushes the local copy as usual
        cy.wait('@put');
        cy.then(() => putReputations.length = 0);

        // When
        cy.get('[data-test=reload-campaign]').click();
        cy.get('.mdc-dialog--open').contains('button', 'Confirm').click();

        // Then the server's copy replaced the newer local one instead of being overwritten by it
        cy.wait('@getStory');
        cy.window().its('app.campaignData.sheet.reputation').should('eq', 7);
        cy.window().then((win) => expect(JSON.parse(win.localStorage.getItem('_9')).sheet.reputation).eq(7));
        cy.then(() => expect(putReputations).not.to.include(3));
    });

    it('It boots without the stylesheet', () => {
        // Given the page has no stylesheet yet, as on iOS when it hasn't loaded
        cy.intercept('/tracker/', (req) => req.continue((res) => {
            res.body = res.body.replace(/<link[^>]*css\/app\.css[^>]*>/, '');
        }));

        // When
        cy.visit('/tracker/#/story', {onBeforeLoad: (win) => cy.spy(win.console, 'error').as('consoleError')});

        // Then
        cy.get('#chapter1').should('exist');
        cy.get('@consoleError').should('not.have.been.called');
    });

    it('It applies the chosen font, also after a reload', () => {
        // Given
        cy.visit('/tracker/#/settings');

        // When
        cy.get('.font-switch .mdc-select__anchor').click();
        cy.get('.font-switch li[data-value="Arial"]').click();
        cy.get('#font-apply-headers').check({force: true});
        cy.get('#font-apply-storyline').check({force: true});

        // Then
        const assertFonts = () => cy.document().should((doc) => {
            expect(getComputedStyle(doc.body).fontFamily).to.match(/^Arial/);
            expect(getComputedStyle(doc.querySelector('h1')).fontFamily).to.match(/^Arial/);
        });
        assertFonts();
        cy.visit('/tracker/#/story');
        cy.get('#storyline text').first().should((text) => expect(getComputedStyle(text[0]).fontFamily).to.match(/^Arial/));
        cy.reload();
        cy.get('#storyline text').first().should((text) => expect(getComputedStyle(text[0]).fontFamily).to.match(/^Arial/));
        cy.visit('/tracker/#/settings');
        assertFonts();
    it('It copies through the fallback when the Clipboard API is blocked', () => {
        // Given the Clipboard API is blocked by a permissions policy
        cy.visit('/tracker/#/settings');
        cy.window().then((win) => {
            cy.stub(win.navigator.clipboard, 'writeText').rejects(new win.DOMException('Blocked', 'NotAllowedError'));
            cy.stub(win.document, 'execCommand').returns(true).as('execCommand');
        });

        // When the backup link is copied
        cy.get('[data-test="copy-backup"]').click();

        // Then it is copied through the fallback
        cy.get('@execCommand').should('have.been.calledOnceWith', 'copy');
        cy.get('.toast').contains('Copied');
    });

    it('It says when copying failed', () => {
        // Given the Clipboard API is missing and the fallback fails
        cy.visit('/tracker/#/settings');
        cy.window().then((win) => {
            cy.stub(win.navigator.clipboard, 'writeText').rejects(new win.DOMException('Blocked', 'NotAllowedError'));
            cy.stub(win.document, 'execCommand').returns(false);
        });

        // When the backup link is copied
        cy.get('[data-test="copy-backup"]').click();

        // Then the user is told it failed
        cy.get('.toast').contains('Could not copy');
    });
});
