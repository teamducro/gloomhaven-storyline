// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Clear any service worker left over from a previous local build so it can't serve stale assets.
before(() => {
    cy.visit('/tracker');
    cy.window().then((win) => {
        const unregister = win.navigator.serviceWorker?.getRegistrations().then((registrations) => {
            return Promise.all(registrations.map((registration) => registration.unregister()));
        });
        return Promise.race([unregister, new Promise((resolve) => setTimeout(resolve, 2000))]);
    });
    cy.reload();
});

// Production builds (CI) open the donations popup on every 5th page load, which covers the page under test.
Cypress.on('window:before:load', (win) => win.localStorage.setItem('donations', '0'));

// The app's service worker caches every same-origin 200 GET, including stubbed API responses, which then leak into later tests.
Cypress.on('window:before:load', (win) => delete Object.getPrototypeOf(win.navigator).serviceWorker);
