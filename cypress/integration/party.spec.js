import utilities from "../utilities";

describe('Party', () => {

    it('It loads the party sheet', () => {
        cy.visit('/#/party');

        cy.contains('Reputation');
        cy.contains('Shop modifier');
        cy.contains('Sanctuary');
        cy.contains('Prosperity');
        cy.contains('Prosperity Items');
        cy.contains('Item Designs');
        cy.contains('notes');
        cy.contains('Unlocks');
    });

});
