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

    describe('in read only mode', () => {
        beforeEach(() => {
            utilities.enableGame('fh');
            utilities.switchGame('fh');
        });

        it('It cant change buildings', () => {
            cy.visit('/tracker/#/buildings');
            // Wreck one building first so its (icon-only) Repair button is checked as well.
            cy.contains('button', 'Wreck').click();

            utilities.setReadOnly().then(() => {
                cy.contains('h2', 'Buildings').parent()
                    .find('.mdc-button')
                    .filter((index, button) => !button.closest('.mdc-dialog'))
                    .should('have.length.greaterThan', 0)
                    .each(($button) => expect($button).to.be.disabled);
            });
        });

        it('It cant remove a wall by clicking its badge', () => {
            cy.visit('/tracker/#/buildings');
            cy.window().then((win) => {
                win.app.overlays.firstWhere('_name', 'Wall').present = true;
            });
            cy.get('#overlay-badges .bedge').should('have.length', 1);

            utilities.setReadOnly().then(() => {
                cy.get('#overlay-badges .bedge').click();
                cy.get('#overlay-badges .bedge').should('have.length', 1);
            });
        });

        it('It cant unlock alchemy potions', () => {
            cy.visit('/tracker/#/party');

            utilities.setReadOnly().then(() => {
                cy.get('a.cursor-pointer.outline-gray').first().click();
                cy.get('.mdc-dialog--open').contains('button', 'Confirm').should('be.disabled');
            });
        });

        it('It cant remove calendar sections', () => {
            cy.visit('/tracker/#/party');
            cy.get('.md\\:grid-cols-20 > div').first().click();
            cy.get('.mdc-dialog--open').contains('button', 'Add').click();

            // The week can't be opened in read only mode, so switch while it's open.
            utilities.setReadOnly().then(() => {
                cy.get('.mdc-dialog--open ul button').first().should('be.disabled');
            });
        });
    });
});
