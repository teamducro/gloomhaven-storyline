export default {
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
                cy.window().then((window) => {
                    fulfilled(window.localStorage);
                });
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
        cy.get('#node' + id + ' .blocked').should(($node) => {
            expect($node).css('display', 'block');
        });
    },

    isNodeRequired(id) {
        this.isNodeVisible(id);
        cy.get('#node' + id + ' .required').should(($node) => {
            expect($node).css('display', 'block');
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
