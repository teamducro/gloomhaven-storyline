import utilities from "../utilities";

describe('Storyline GH2', () => {

    // Cypress clears storage between tests, so the game must be enabled each time
    beforeEach(() => {
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');
    })

    it('It loads the gh2 storyline', () => {
        cy.visit('/tracker');

        cy.get('#storyline').should('have.class', 'storyline-gh2');
        cy.get('.chapter.intro').should('have.css', 'display', 'inline');
        utilities.isNodeIncomplete(1);
        utilities.isNodeHidden(2);
        cy.get('#edge1-2').should('have.css', 'display', 'none');
        cy.get('#node201').should('not.exist');
    });

    it('It completes a gh2 scenario and shows the edge', () => {
        cy.visit('/tracker');

        utilities.completeScenario(1);
        utilities.isNodeIncomplete(2);
        cy.get('#edge1-2').should('have.css', 'display', 'inline');
    });

    it('It switches gh2 between landscape and portrait', () => {
        cy.visit('/tracker');

        utilities.assertCount('#storyline .landscape', 1);
        cy.get('#storyline .portrait').should('not.exist');

        cy.viewport(500, 800);

        utilities.assertCount('#storyline .portrait', 1);
        cy.get('#storyline .landscape').should('not.exist');
    });
});
