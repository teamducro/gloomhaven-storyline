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

    isSideNodeHidden(id) {
        this.isNodeVisible(id);
        cy.get('#node' + id + '.opacity-50').should('be.visible');
    },

    isNodeOrSideNodeHidden(id) {
        cy.get('#node' + id).should(($node) => {
            if ($node.css('display') != 'none') {
                expect($node).class('opacity-50')
            } else {
                expect($node).css('display', 'none');
            }
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

    checkNodeState(id, state) {
        switch (state) {
            case "hidden":
                return this.isNodeOrSideNodeHidden(id);
            case "incomplete":
                return this.isNodeIncomplete(id);
            case "complete":
                return this.isNodeComplete(id);
            case "blocked":
                return this.isNodeBlocked(id);
            case "required":
                return this.isNodeRequired(id);
        }
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

    lockSideScenario(id) {
        this.openScenario(id);
        cy.get('#scenario-content label').contains('Not unlocked').click();
        this.closeModel();
    },

    openScenario(id) {
        cy.get('#node' + id).click();
    },

    closeModel() {
        cy.get('body').click('left');
    },

    isTracker() {
        cy.url().should('include', '/tracker');
    }
}
