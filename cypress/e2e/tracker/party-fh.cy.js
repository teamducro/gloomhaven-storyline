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

    it('It starts new campaigns with four soldiers', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/party');

        cy.get('#s-4').should('be.checked');
        cy.get('#s-5').should('not.be.checked');
    });

    it('It shows the Ancient Coins requirement for upgrading the Tavern to level 3', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/party');
        cy.window().then((win) => {
            const tavern = win.app.buildings.firstWhere('id', 74);
            tavern.state = 'built';
            tavern.level = 1;
        });
        cy.visit('/tracker/#/buildings');
        cy.contains('Requires 3 Ancient Coins (Item 245)').should('not.exist');

        cy.window().then((win) => {
            win.app.buildings.firstWhere('id', 74).level = 2;
        });
        cy.visit('/tracker/#/buildings');
        cy.contains('Requires 3 Ancient Coins (Item 245)');
    });

    it('It uses the same season for a calendar week in the grid and in the week modal', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/party');

        cy.get('.md\\:grid-cols-20 > div').eq(9).should('have.class', 'bg-orange-1000').click();
        cy.get('.mdc-dialog--open').contains('Week 10 Summer');
        utilities.closeModel();

        cy.get('.md\\:grid-cols-20 > div').eq(10).should('have.class', 'bg-blue-1000').click();
        cy.get('.mdc-dialog--open').contains('Week 11 Winter');
    });
});
