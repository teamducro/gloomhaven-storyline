import utilities from "../utilities";

describe('Items', () => {

    it('It checks item designs', () => {
        cy.visit('/tracker/#/items');

        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-75').click();
        utilities.closeModel();
        cy.get('#items').contains('Circlet of Elements');

        // Make sure it also works after a reload!
        cy.reload(true);
        cy.get('#items').contains('Circlet of Elements');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-71').click();
        utilities.closeModel();
        cy.get('#items').contains('Boots of Levitation');

        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-75').click();
        utilities.closeModel();
        cy.get('#items').contains('Circlet of Elements').should('not.exist');
    });

    it('It can search items', () => {
        cy.visit('/tracker/#/items');

        assertItemCount(14);

        cy.get('[name="item-search"]').type('boots');
        assertItemCount(1);
    });

    it('It can filter items', () => {
        cy.visit('/tracker/#/items');

        assertItemCount(14);

        cy.get('[alt="body"]').click();
        assertItemCount(3);

        cy.get('[alt="head"]').click();
        assertItemCount(2);

        cy.get('[alt="small-item"]').click();
        assertItemCount(3);
    });

    it('It opens item modal', () => {
        cy.visit('/tracker/#/items');

        cy.get('#items tbody tr:first').click();
        cy.get('.mdc-dialog').contains('Prosperity 1');
    });

    it('It unlocks items from treasures', () => {
        cy.visit('/tracker?states=1_c-2_c-4_c');

        // Unlock treasure
        utilities.openScenario(4);
        cy.get('#38').parent().click();

        // The item is clickable
        cy.get('a').contains('Ring of Skulls').click();
        cy.get('p').contains('Scenario #04 (Treasure #38)');
        utilities.closeModel();
        utilities.closeModel();

        // The item is unlocked
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Ring of Skulls');

        // Lock treasure
        cy.visit('/tracker/#/story');
        utilities.openScenario(4);
        cy.get('#38').parent().click();
        cy.get('a').contains('Ring of Skulls').should('not.exist');
        utilities.closeModel();

        // The item is locked
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Ring of Skulls').should('not.exist');
    });

    it('It unlocks items from rewards', () => {
        cy.visit('/tracker?states=52_c');

        // Complete scenario
        utilities.openScenario(53);
        cy.get('#scenario-content label').contains('Complete').click();

        // The item is clickable
        cy.get('a').contains('Staff of Xorn').click();
        cy.get('p').contains('Reward from Scenario #53');
        utilities.closeModel();
        utilities.closeModel();

        // The item is unlocked
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Staff of Xorn');

        // Incomplete scenario
        cy.visit('/tracker/#/story');
        utilities.openScenario(53);
        cy.get('#scenario-content label').contains('Incomplete').click();
        cy.get('a').contains('Staff of Xorn').should('not.exist');
        utilities.closeModel();

        // The item is locked
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Staff of Xorn').should('not.exist');
    });

});

function assertItemCount(count) {
    cy.get('#items tbody tr').should(($list) => {
        expect($list).to.have.length(count);
    });
}
