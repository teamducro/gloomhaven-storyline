describe('PWA', {env: {serviceWorker: true}}, () => {

    it('It doesn\'t reload on the first install', () => {
        // Given a first visit, without a worker (the support file removes it before each spec, so this test goes first)
        cy.visit('/tracker/#/story');
        cy.window().then((win) => win.firstLoad = true);

        // When the worker installs and takes over
        cy.window().its('navigator.serviceWorker.controller', {timeout: 20000}).should('exist');

        // Then the page was not reloaded
        cy.window().its('firstLoad').should('eq', true);
    });

    it('It ignores a registration without a result', () => {
        // Given a browser whose register() resolves without a registration
        // Another URL than the previous test, so the page loads and onBeforeLoad runs.
        cy.visit('/tracker/?register#/story', {
            onBeforeLoad: (win) => win.registerStub = cy.stub(win.navigator.serviceWorker, 'register').resolves(undefined)
        });

        // Then registering causes no error
        cy.window().its('registerStub').should('have.been.calledOnce');
        cy.get('#chapter1').should('be.visible');
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

        // The browser's HTTP cache would otherwise serve files the service worker didn't cache.
        cy.wrap(Cypress.automation('remote:debugger:protocol', {command: 'Network.clearBrowserCache'}));
        cy.intercept({hostname: new URL(Cypress.config('baseUrl')).hostname}, {forceNetworkError: true});
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
        // Installing the new worker downloads every precached file, slow over a real network (prod smoke run).
        cy.window().then({timeout: 30000}, async (win) => {
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

            win.stale = true;
            await win.navigator.serviceWorker.register('/service-worker.js?update');
            return moved;
        }).as('moved');

        // The new worker reloads the page once it has taken over.
        cy.window({timeout: 20000}).should('not.have.property', 'stale');
        cy.get('@moved').then((moved) => cy.window().then(async (win) => {
            expect(await win.caches.has('storyline-cache-v-previous')).to.be.false;
            const [cacheName] = await win.caches.keys();
            const cache = await win.caches.open(cacheName);
            for (const url of moved) {
                expect(await cache.match(url), url).to.exist;
            }
        }));
        cy.contains('Abgeschlossen');
    });

    it('It installs when a precached file fails to load', () => {
        // Given a worker controls the tracker
        cy.visit('/tracker/#/story');
        cy.window().its('navigator.serviceWorker.controller', {timeout: 20000}).should('exist');

        // When a new worker installs while one precached chunk fails
        cy.request('/service-worker.js').then(({body}) => {
            const chunk = body.match(/'(\/js\/[^']+\.js)'/)[1];
            cy.intercept(chunk, {statusCode: 500});
        });
        cy.window().then((win) => win.navigator.serviceWorker.register('/service-worker.js?failed-chunk'));

        // Then the new worker still takes over
        cy.window({timeout: 20000}).its('navigator.serviceWorker.controller.scriptURL').should('include', '?failed-chunk');
    });

    it('It precaches the stylesheet url the page requests', () => {
        // Given
        cy.request('/tracker/').then(({body: html}) => {
            const href = html.match(/href="([^"]*\/css\/app\.css[^"]*)"/)[1];

            // Then
            cy.request('/service-worker.js').its('body').should('include', `'${href}'`);
        });
    });
});
