import utilities from "../utilities";

describe('Scenario list', () => {

    it('It loads the scenario list', () => {
        cy.visit('/tracker/#/scenarios');

        cy.get('#scenarios').within(() => {
            cy.contains('#1 Black Barrow');
        });

        utilities.assertTableCount('scenarios', 113);
    });

    it('It opens a scenario', () => {
        cy.visit('/tracker/#/scenarios');

        cy.get('td').contains('#1 Black Barrow').click();
        cy.get('label').contains('Incomplete');
        cy.get('label').contains('Complete');
    });

    it('It filters on incomplete scenarios', () => {
        cy.visit('/tracker?states=1_c');
        cy.visit('/tracker/#/scenarios');

        cy.get('#scenarios').within(() => {
            cy.contains('#1 Black Barrow').should('be.visible');
        });

        cy.get('button').contains('filter_list').click();
        cy.get('span').contains('incomplete').click();
        utilities.closeModel();

        cy.get('#scenarios').within(() => {
            cy.contains('#1 Black Barrow').should('not.be.visible');
        });

        utilities.assertTableCount('scenarios', 7);
    });

    it('It filters on mist treasures', () => {
        cy.visit('/tracker?states=1_c');
        cy.visit('/tracker/#/scenarios');

        cy.get('#scenarios').within(() => {
            cy.contains('#1 Black Barrow').should('be.visible');
        });

        cy.get('button').contains('filter_list').click();
        cy.get('span').contains('Missed Treasures').click();
        utilities.closeModel();

        utilities.assertTableCount('scenarios', 1);
    });

    it('It filters on regions', () => {
        cy.visit('/tracker?states=1_c-2_c');
        cy.visit('/tracker/#/scenarios');

        cy.get('#scenarios').within(() => {
            cy.contains('#1 Black Barrow').should('be.visible');
        });

        cy.get('button').contains('filter_list').click();
        cy.get('span').contains('Crypt').click();
        utilities.closeModel();

        cy.get('#scenarios').within(() => {
            cy.contains('#1 ').should('not.be.visible');
            cy.contains('#2 ').should('not.be.visible');
            cy.contains('#3 ').should('not.be.visible');
        });

        cy.get('#scenarios').within(() => {
            cy.contains('#4').should('be.visible');
        });
    });

    it('Only show scenarios from selected game', () => {
        cy.visit('/tracker/#/scenarios');

        utilities.assertTableCount('scenarios', 113);

        utilities.switchGame('fc');
        cy.visit('/tracker/#/scenarios');

        utilities.assertTableCount('scenarios', 22);

        utilities.switchGame('jotl');
        cy.visit('/tracker/#/scenarios');

        utilities.assertTableCount('scenarios', 25);
    });

    it('It filters solo scenarios', () => {
        cy.visit('/tracker/#/scenarios');

        cy.get('button').contains('filter_list').click();
        cy.get('span').contains('Solo').click();
        utilities.closeModel();

        cy.get('#scenarios').contains('#1 ').should('not.be.visible');

        cy.get('#scenarios').contains('Return to the Black Barrow').should('be.visible');
    });

});
