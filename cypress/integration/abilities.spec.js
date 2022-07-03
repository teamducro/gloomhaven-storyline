import utilities from "../utilities";

describe('Abilities', () => {

    it('It loads a characters abilities', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('h1').contains('Local Campaign Cragheart Abilities');
    });

    it('It can add/remove abilities to/from the deck', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('#deck-avalanche').should('not.exist');

        cy.get('#available-avalanche').click();

        cy.get('#deck-avalanche').should('exist');

        cy.get('#deck-avalanche').click();

        cy.get('#deck-avalanche').should('not.exist');
    });

    it('It can show all abilities', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        utilities.assertCount('.ability-card.available', 14);

        cy.get('#show-all-abilities').click();

        utilities.assertCount('.ability-card.available', 30);
    });

    it('It can sort abilities', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('.ability-card.available:first-child #available-unstable-upheaval').should('not.exist');

        cy.get('#ability-sort-dropdown button').click();
        cy.get('#ability-sort-dropdown span').contains('initiative arrow_upward').click();

        cy.get('.ability-card.available:first-child #available-unstable-upheaval').should('exist');
    });

    it('It can toggle sides', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('#available-avalanche').click();

        cy.get('.available-header .material-icons').contains('layers').should('exist');
        cy.get('.available-header .material-icons').contains('grid_view').should('not.exist');
        cy.get('.deck-header .material-icons').contains('layers').should('not.exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('exist');

        cy.get('.available-header .side-toggle').click();

        cy.get('.available-header .material-icons').contains('layers').should('not.exist');
        cy.get('.available-header .material-icons').contains('grid_view').should('exist');
        cy.get('.deck-header .material-icons').contains('layers').should('exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('not.exist');

        cy.get('.deck-header .side-toggle').click();

    });

    it('It can collapse the grid', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('.available-header .material-icons').contains('grid_view').should('not.exist');
        cy.get('.available-header .material-icons').contains('layers').click();
        cy.get('.available-header .material-icons').contains('grid_view').should('exist');
        cy.get('.available-header .material-icons').contains('layers').should('not.exist');

        cy.get('.deck-header .material-icons').contains('layers').should('not.exist');
        cy.get('.deck-header .material-icons').contains('grid_view').click();
        cy.get('.deck-header .material-icons').contains('layers').should('exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('not.exist');
    });

});
