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

});

function assertItemCount(count) {
    cy.get('#items tbody tr').should(($list) => {
        expect($list).to.have.length(count);
    });
}
