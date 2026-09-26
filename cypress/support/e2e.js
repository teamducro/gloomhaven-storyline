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
        return win.navigator.serviceWorker?.getRegistrations().then((registrations) => {
            return Promise.all(registrations.map((registration) => registration.unregister()));
        });
    });
    cy.reload();
});
