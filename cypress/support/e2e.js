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

// Clear any service worker left over from a previous local build or an aborted PWA spec, so it can't serve stale
// assets. The website doesn't register one, unlike the tracker.
let clearingServiceWorkers = false;
before(() => {
    cy.then(() => clearingServiceWorkers = true);
    cy.visit('/');
    cy.window().then((win) => {
        const unregister = win.navigator.serviceWorker.getRegistrations().then((registrations) => {
            return Promise.all(registrations.map((registration) => registration.unregister()));
        });
        return Promise.race([unregister, new Promise((resolve) => setTimeout(resolve, 2000))]);
    });
    cy.then(() => clearingServiceWorkers = false);
});

// Production builds (CI) open the donations popup on every 5th page load, which covers the page under test.
Cypress.on('window:before:load', (win) => win.localStorage.setItem('donations', '0'));

// Keep the service worker's cache from leaking between tests; specs that test it opt in with {env: {serviceWorker: true}}.
Cypress.on('window:before:load', (win) => Cypress.env('serviceWorker') || clearingServiceWorkers || delete Object.getPrototypeOf(win.navigator).serviceWorker);
