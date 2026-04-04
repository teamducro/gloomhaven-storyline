import utilities from "../utilities";

describe('Party FH', () => {

    // Enable Frosthaven and switch to it
    before(() => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
    })

    it('It loads the campaign sheet', () => {
        cy.visit('/tracker/#/party');

        cy.contains('Campaign sheet');
        cy.contains('Morale');
        cy.contains('Defense');
        cy.contains('Town Guard Perks');
        cy.contains('Prosperity');
        cy.contains('Scenario level');
        cy.contains('Summer Outpost Event Decks');
        cy.contains('Summer Road Event Decks');
        cy.contains('notes');
    });
});
