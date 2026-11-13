describe('PWA', {env: {serviceWorker: true}}, () => {

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

        // The browser's HTTP cache would otherwise serve files the service worker didn't cache.
        cy.wrap(Cypress.automation('remote:debugger:protocol', {command: 'Network.clearBrowserCache'}));
        cy.intercept({url: /localhost/}, {forceNetworkError: true});
        cy.reload();

        cy.get('#chapter1').should('be.visible');
        cy.screenshot('offline-story', {capture: 'viewport'});
    });

    it('It opens the cached tracker on a slow connection', () => {
        cy.visit('/tracker/#/story');
        cy.window().its('navigator.serviceWorker.controller', {timeout: 20000}).should('exist');

        cy.intercept({url: /\/tracker\/$/}, {delay: 15000, body: 'Too slow'});
        cy.reload();

        cy.get('#chapter1', {timeout: 8000}).should('be.visible');
    });

    it('It keeps the used language when a new worker takes over', () => {
        cy.visit('/tracker/#/story', {
            onBeforeLoad: (win) => {
                win.localStorage.setItem('lang', '"de"');
                win.localStorage.setItem('ptSplit', 'true');
            }
        });
        cy.window().its('navigator.serviceWorker.controller', {timeout: 20000}).should('exist');
        // Load the language through the worker, so it's cached.
        cy.reload();
        cy.contains('Abgeschlossen');

        // Like a deploy: the language is only in the previous worker's cache, and a new worker takes over.
        cy.window().then(async (win) => {
            const languageFiles = (await (await win.fetch('/service-worker.js')).text())
                .match(/LANGUAGE_FILES = \[([^\]]*)]/)[1];
            const [cacheName] = await win.caches.keys();
            const cache = await win.caches.open(cacheName);
            const oldCache = await win.caches.open('storyline-cache-v-previous');
            const moved = [];
            for (const request of await cache.keys()) {
                if (languageFiles.includes(`'${new URL(request.url).pathname}'`)) {
                    await oldCache.put(request, await cache.match(request));
                    await cache.delete(request);
                    moved.push(request.url);
                }
            }
            expect(moved).not.to.be.empty;

            const registration = await win.navigator.serviceWorker.register('/service-worker.js?update');
            const worker = registration.installing || registration.waiting || registration.active;
            await new Promise((resolve) => worker.state === 'activated'
                ? resolve()
                : worker.addEventListener('statechange', () => worker.state === 'activated' && resolve()));

            expect(await win.caches.has('storyline-cache-v-previous')).to.be.false;
            for (const url of moved) {
                expect(await cache.match(url), url).to.exist;
            }
        });
    });
});
