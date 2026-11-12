describe('PWA', {env: {serviceWorker: true}}, () => {

    after(() => {
        cy.window().then((win) => win.navigator.serviceWorker.getRegistrations()
            .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister()))));
    });

    it('It has an installable manifest', () => {
        cy.request('/manifest.json').its('body').should((manifest) => {
            expect(manifest.display).to.equal('standalone');
            expect(manifest.start_url).to.equal('/tracker/#/story');
            expect(manifest.orientation).to.be.undefined;
            expect(manifest.icons.map((icon) => icon.purpose)).to.include('maskable');
        });
    });

    it('It never serves API calls from the cache', () => {
        cy.intercept('GET', '**/ping*', {statusCode: 200, body: 'first'});
        cy.visit('/tracker/#/story');
        cy.window().its('navigator.serviceWorker.controller', {timeout: 20000}).should('exist');
        cy.window().then((win) => win.fetch('/ping').then((response) => response.text())).should('equal', 'first');

        cy.intercept('GET', '**/ping*', {statusCode: 200, body: 'second'});
        cy.window().then((win) => win.fetch('/ping').then((response) => response.text())).should('equal', 'second');
    });

    it('It opens the tracker offline', () => {
        cy.visit('/tracker/#/story');
        cy.window().its('navigator.serviceWorker.controller', {timeout: 20000}).should('exist');

        cy.intercept({url: /localhost/}, {forceNetworkError: true});
        cy.reload();

        cy.get('#chapter1').should('be.visible');
        cy.screenshot('offline-story', {capture: 'viewport'});
    });
});
