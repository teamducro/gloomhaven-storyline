import utilities from "../utilities";

describe('Story summaries', () => {

    it('It asks to complete a scenario when no story has started', () => {
        cy.visit('/tracker/#/summaries');

        cy.get('#summaries').contains('Complete a scenario to start your story.');
        cy.get('#summaries .arc').should('not.exist');
    });

    it('It shows the summary of every started story arc and opens their scenarios', () => {
        cy.visit('/tracker');
        utilities.completeScenario(1);

        cy.contains('button', /^\s*menu\s*$/).click();
        cy.get('.mdc-drawer--open').contains('Story summaries').click();
        cy.location('hash').should('eq', '#/summaries');
        // In Cypress the drawer stays open after navigating and covers the page
        cy.reload();

        cy.get('#summaries .arc').first().within(() => {
            cy.get('h2').should('have.text', "The Merchant's Request");
            cy.contains('Jekserah');
            cy.get('button').contains('1').click();
        });
        cy.get('.mdc-dialog--open').contains('Black Barrow');
    });

    it('It names Forgotten Circles arcs after their scenario', () => {
        cy.visit('/tracker');
        utilities.switchGame('fc');
        utilities.completeScenario(96);

        cy.visit('/tracker/#/summaries');

        cy.get('#summaries .arc h2').should('have.text', 'Unexpected Visitors');
        cy.get('#summaries').contains('Cassandra');
    });
});
