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

        cy.get('#desktop-show-all-abilities').click();

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

        cy.get('.available-header .material-icons').contains('content_copy').should('exist');
        cy.get('.available-header .material-icons').contains('grid_view').should('not.exist');
        cy.get('.deck-header .material-icons').contains('content_copy').should('not.exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('exist');

        cy.get('.available-header .side-toggle').click();

        cy.get('.available-header .material-icons').contains('content_copy').should('not.exist');
        cy.get('.available-header .material-icons').contains('grid_view').should('exist');
        cy.get('.deck-header .material-icons').contains('content_copy').should('exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('not.exist');

        cy.get('.deck-header .side-toggle').click();

    });

    it('It can collapse the grid', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('.available-header .material-icons').contains('grid_view').should('not.exist');
        cy.get('.available-header .material-icons').contains('content_copy').click();
        cy.get('.available-header .material-icons').contains('grid_view').should('exist');
        cy.get('.available-header .material-icons').contains('content_copy').should('not.exist');

        cy.get('.deck-header .material-icons').contains('content_copy').should('not.exist');
        cy.get('.deck-header .material-icons').contains('grid_view').click();
        cy.get('.deck-header .material-icons').contains('content_copy').should('exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('not.exist');
    });

    it('It can\'t manage abilities at level 1', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('button').contains('Manage').click();

        cy.get('h2').contains('Manage abilities for each level');
        cy.get('p').contains('Please level Cragheart first before managing abilities');
        cy.get('.slot-2').should('not.exist');
    });

    it('It can manage abilities at higher levels', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('2{enter}');
        utilities.openAbilities('Cragheart', false);

        cy.get('#open-manage-abilities').click();

        cy.get('h2').contains('Manage abilities for each level');
        cy.get('p').contains('Select an ability card for each level, after choosing cards the available cards will be filtered accordingly');
        cy.get('.slot-2 .border-dashed').should('exist');
    });

    it('It filters available abilities', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('2{enter}');
        utilities.openAbilities('Cragheart', false);

        cy.get('#open-manage-abilities').click();

        cy.get('#manage-available-explosive-punch').click();
        cy.get('.slot-2 .border-dashed').should('not.exist');
        cy.get('.slot-2 #selected-available-explosive-punch').should('exist');

        utilities.closeModel();

        cy.get('#available-explosive-punch').should('exist');
        cy.get('#available-sentient-growth').should('not.exist');
    });

});
