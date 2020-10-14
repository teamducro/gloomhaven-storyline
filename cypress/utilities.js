export default {
    startServer() {
        cy.server();

        cy.route({
            method: 'GET',
            url: 'sanctum/csrf-cookie',
            status: 204,
            response: ''
        }).as('csrf');
    },

    scenarios() {
        return cy.wrap(
            new Promise((fulfilled) => {
                cy.window().then((window) => {
                    fulfilled(window.app.scenarios);
                });
            })
        );
    },

    achievements() {
        return cy.wrap(
            new Promise((fulfilled) => {
                cy.window().then((window) => {
                    fulfilled(window.app.achievements);
                });
            })
        );
    },

    store() {
        return cy.wrap(
            new Promise((fulfilled) => {
                cy.window().then((window) => fulfilled(window.localStorage));
            })
        );
    },

    isNodeVisible(id) {
        cy.get('#node' + id).should(($node) => {
            expect($node).css('display', 'inline');
        });
    },

    isNodeHidden(id) {
        cy.get('#node' + id).should(($node) => {
            expect($node).css('display', 'none');
        });
    },

    isNodeBlocked(id) {
        this.isNodeVisible(id);
        cy.get('#node' + id + '.blocked .blocked').should('be.visible');
    },

    isNodeRequired(id) {
        this.isNodeVisible(id);
        cy.get('#node' + id + '.required .required').should('be.visible');
    },

    isNodeComplete(id) {
        this.isNodeVisible(id);
        cy.get('#node' + id + '.complete').should('be.visible');
    },

    isNodeIncomplete(id) {
        this.isNodeVisible(id);
        cy.get('#node' + id + '.incomplete').should(($node) => {
            expect($node).css('display', 'inline');
        });
    },

    completeScenario(id) {
        this.openScenario(id);
        cy.get('#scenario-content label').contains('Complete').click();
        this.closeModel();
    },

    incompleteScenario(id) {
        this.openScenario(id);
        cy.get('#scenario-content label').contains('Incomplete').click();
        this.closeModel();
    },

    openScenario(id) {
        cy.get('#node' + id).click();
    },

    closeModel() {
        cy.get('body').click('left');
    }
}
