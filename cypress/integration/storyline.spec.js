describe('Storyline', () => {

    it('It loads the storyline', () => {
        cy.visit('/');

        cy.get('#chapter1')
            .should('have.css', 'display')
            .and('eq', 'inline');
    });

    it('It can complete a scenario', () => {
        cy.visit('/');
        isNodeVisible(1);
        isNodeHidden(2);

        completeScenario(1);

        isNodeVisible(2);
    });

    it('It can incomplete a scenario', () => {
        cy.visit('/');
        completeScenario(1);

        isNodeVisible(2);

        incompleteScenario(1);

        isNodeHidden(2);
    });

    it('It reveals chapters', () => {
        cy.visit('/');

        cy.get('#chapter2')
            .should('have.css', 'display')
            .and('eq', 'none');

        cy.visit('/?completed=1-2');

        cy.get('#chapter2')
            .should('have.css', 'display')
            .and('eq', 'inline');
    });

    it('It blocks blocked scenarios', () => {
        cy.visit('/?completed=1-2-3-8');

        isNodeBlocked(9);
        openScenario(9);
        cy.get('#complete')
            .should('have.attr', 'disabled')
            .and('eq', 'disabled');
        closeModel();
    });

    it('It blocks required scenarios', () => {
        cy.visit('/?completed=1-2-3-8');

        isNodeRequired(7);
        openScenario(7);
        cy.get('#complete')
            .should('have.attr', 'disabled')
            .and('eq', 'disabled');
        closeModel();
    });

    it('It unlocks required scenarios', () => {
        cy.visit('/?completed=1-2-3-8');

        isNodeRequired(7);

        completeScenario(14);

        isNodeVisible(7);
        cy.get('#node7 .required')
            .should('have.css', 'display')
            .and('eq', 'none');

        openScenario(7);
        cy.get('#complete')
            .should('not.have.attr', 'disabled');
        closeModel();
    });

    function isNodeVisible(id) {
        cy.get('#node' + id)
            .should('have.css', 'display')
            .and('eq', 'inline');
    }

    function isNodeHidden(id) {
        cy.get('#node' + id)
            .should('have.css', 'display')
            .and('eq', 'none');
    }

    function isNodeBlocked(id) {
        isNodeVisible(id);
        cy.get('#node' + id + ' .blocked')
            .should('have.css', 'display')
            .and('eq', 'block');
    }

    function isNodeRequired(id) {
        isNodeVisible(id);
        cy.get('#node' + id + ' .required')
            .should('have.css', 'display')
            .and('eq', 'block');
    }

    function completeScenario(id) {
        openScenario(id);
        cy.get('#scenario-content label').contains('Complete').click();
        closeModel();
    }

    function incompleteScenario(id) {
        openScenario(id);
        cy.get('#scenario-content label').contains('Incomplete').click();
        closeModel();
    }

    function openScenario(id) {
        cy.get('#node' + id).click();
    }

    function closeModel() {
        cy.get('body').click('left');
    }

});
