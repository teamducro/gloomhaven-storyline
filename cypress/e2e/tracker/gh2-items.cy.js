import utilities from "../utilities";

describe('GH2 Items', () => {

    beforeEach(() => {
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');
    });

    it('It starts with the prosperity 1 shop', () => {
        cy.visit('/tracker/#/items');

        utilities.assertTableCount('items', 17);
        cy.get('#items').contains('Weathered Boots');
        cy.get('#items').contains('Fated Verses');
        cy.get('#items').contains('Boots of Speed').should('not.exist');
        cy.contains('Shop modifier').should('not.exist');
    });

    it('It adds items when prosperity increases', () => {
        cy.visit('/tracker/#/party');
        // Prosperity level 2 = index 6 on the gh2 track (07: breaks 1/6/13/23/34/46/60/75/90).
        cy.get('input#p-6').click();

        cy.visit('/tracker/#/items');
        utilities.assertTableCount('items', 25);
        cy.get('#items').contains('Boots of Speed');
    });

    it('It checks item designs and flips a flip item', () => {
        cy.visit('/tracker/#/items');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-100').click();
        utilities.closeModel();

        cy.reload(true);
        cy.get('#items').contains('Charged Boots').click();
        cy.get('.mdc-dialog').contains('h2', '#100');
        cy.get('.mdc-dialog img[src*="/img/items/gh2/charged-boots"]').should('exist');

        cy.get('.mdc-dialog .flip-card .inner').should('not.have.class', 'flipped');
        cy.get('.mdc-dialog').contains('button', 'flip').click();
        cy.get('.mdc-dialog .flip-card .inner').should('have.class', 'flipped');
    });

    it('It searches by id', () => {
        cy.visit('/tracker/#/items');
        cy.get('[name="item-search"]').type('116');
        utilities.assertTableCount('items', 1);
    });

    it('It buys an item for a character', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Bruiser');
        cy.get('input[aria-labelledby="gold"]').clear({force: true}).type('30{enter}');

        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Weathered Boots').click({scrollBehavior: 'center'});
        cy.get('.mdc-button').contains('Buy').click();
        utilities.closeModel();

        cy.visit('/tracker/#/characters');
        cy.get('#items-bedges').contains('Weathered Boots');
        cy.get('input[aria-labelledby="gold"]').should('have.value', '15');
    });

    it('It merges Mercenary Pack items', () => {
        cy.visit('/tracker/#/items');
        cy.window().its('app.items').invoke('has', 'gh2-AN').should('eq', true);
    });
});
