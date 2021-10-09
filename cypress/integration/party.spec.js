import utilities from "../utilities";

describe('Party', () => {

    it('It loads the party sheet', () => {
        cy.visit('/tracker/#/party');

        cy.contains('Party sheet');
        cy.contains('Reputation');
        cy.contains('Shop modifier');
        cy.contains('Sanctuary');
        cy.contains('Prosperity');
        cy.contains('Prosperity Items');
        cy.contains('City Event Decks');
        cy.contains('Road Event Decks');
        cy.contains('notes');
        cy.contains('Unlocks');
    });

    it('It has a reputation counter', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="reputation"]').clear().type('3{enter}');
        cy.contains('-1 Gold');
        cy.get('input[aria-labelledby="reputation"]').clear().type('20{enter}');
        cy.contains('-5 Gold');
    });

    it('It can roll back reputation counter', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="reputation"]').clear().type('3{enter}');
        cy.get('h2').contains('Reputation').next().click(); // rollback
        cy.get('input[aria-labelledby="reputation"]').should('have.value', '0');
    });

    it('It has a donations counter', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="donations"]').clear().type('100{enter}');
        cy.contains('1 gained prosperity');
        cy.get('input[aria-labelledby="donations"]').type('0{enter}');
        cy.contains('13 gained prosperity');
    });

    it('It can roll back donations counter', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="donations"]').clear().type('3{enter}');
        cy.get('h2').contains('Sanctuary').next().click(); // rollback
        cy.get('input[aria-labelledby="donations"]').should('have.value', '0');
    });

    it('It has prosperity checkboxes', () => {
        cy.visit('/tracker/#/party');

        cy.get('span').contains('015–021').prev().find('input').should('not.be.checked');

        cy.get('input#p-5').click();
        cy.get('input#p-2').should('be.checked');
        cy.get('input#p-3').should('be.checked');
        cy.get('input#p-4').should('be.checked');

        cy.get('span').contains('015–021').prev().find('input').should('be.checked');
    });

    it('It can roll back prosperity checkboxes', () => {
        cy.visit('/tracker/#/party');

        cy.get('input#p-5').click();
        cy.get('h2').contains('Prosperity').next().click(); // rollback
        cy.get('input#p-2').should('not.be.checked');
        cy.get('input#p-3').should('not.be.checked');
        cy.get('input#p-4').should('not.be.checked');
        cy.get('input#p-5').should('not.be.checked');
        cy.get('span').contains('015–021').prev().find('input').should('not.be.checked');
    });

    it('It checks city events', () => {
        cy.visit('/tracker/#/party');

        utilities.scrollTo('40%');
        cy.get('#city-events').parent().click();
        cy.get('[name="city-events"]').type('50');
        cy.get('.mdc-list-item__text span').contains('50').click();
        utilities.closeModel();
        cy.get('.bedge').contains('50').should('be.visible').click();
        cy.get('.bedge').contains('50').should('not.exist');
    });

    it('It can roll back city events', () => {
        cy.visit('/tracker/#/party');

        utilities.scrollTo('35%');
        cy.get('#city-events').parent().click();
        cy.get('[name="city-events"]').clear().type('50');
        cy.get('.mdc-list-item__text span').contains('50').click();
        cy.get('[name="city-events"]').clear().type('60');
        cy.get('.mdc-list-item__text span').contains('60').click();
        utilities.closeModel();
        cy.get('#city-events-bedges .bedge').contains('50').should('be.visible');
        cy.get('#city-events-bedges .bedge').contains('60').should('be.visible');
        cy.get('h2').contains('City Event Decks').next().click(); // rollback
        cy.get('#city-events-bedges .bedge').contains('60').should('not.exist');
        cy.get('h2').contains('City Event Decks').next().click(); // rollback
        cy.get('#city-events-bedges .bedge').contains('50').should('not.exist');
        utilities.closeModel();

        utilities.scrollTo('35%');
        cy.get('#city-events-bedges .bedge').contains('10').click();
        cy.get('#city-events-bedges .bedge').contains('10').should('not.exist');
        cy.get('#city-events-bedges .bedge').contains('15').click();
        cy.get('#city-events-bedges .bedge').contains('15').should('not.exist');

        utilities.scrollTo('35%');
        cy.get('h2').contains('City Event Decks').next().click(); // rollback
        cy.get('#city-events-bedges .bedge').contains('15').should('be.visible');
        cy.get('h2').contains('City Event Decks').next().click(); // rollback
        cy.get('#city-events-bedges .bedge').contains('10').should('be.visible');
    });

    it('It stores the party sheet', () => {
        cy.visit('/tracker/#/party');
        cy.get('input[aria-labelledby="reputation"]').clear().type('20{enter}');
        cy.get('input[aria-labelledby="donations"]').clear().type('1000{enter}');
        cy.get('input#p-65').click();
        utilities.scrollTo('40%');
        cy.get('#city-events').parent().click();
        cy.get('[name="city-events"]').type('50');
        cy.get('.mdc-list-item__text span').contains('50').click();

        utilities.scrollTo('80%');
        cy.get('#notes').type('Foo Bar');
        utilities.closeModel();

        cy.reload();

        cy.get('input[aria-labelledby="reputation"]').should('have.value', '20');
        cy.get('input[aria-labelledby="donations"]').should('have.value', '1000');
        cy.get('input#p-35').should('be.checked');
        cy.get('input#p-65').should('be.checked');
        cy.get('span').contains('064–070').prev().find('input').should('be.checked');
        cy.get('#notes').should('have.value', 'Foo Bar');
        cy.get('.bedge').contains('50').should('be.visible');
    });

    it('it draws event cards', () => {
        cy.visit('/tracker/#/party');
        utilities.scrollTo('50%');
        cy.get('button').contains('Draw').first().click();
        cy.get('.mdc-dialog__title').contains('City Event #').should('be.visible');
        cy.get('.mdc-dialog__content button').contains('A').click();
        cy.get('.mdc-dialog__content button').contains('A').should('not.exist');
        cy.get('.mdc-dialog__content .blur').should('be.visible');
        cy.get('.mdc-dialog__content button').contains('Toggle B').click();
        cy.get('.mdc-dialog__content .blur').should('not.exist');
        cy.get('.mdc-dialog__content button').contains('Toggle B').parent().next().click();
    });

    it('it unlocks envelope X', () => {
        cy.visit('/tracker/#/party');
        utilities.scrollTo('100%');
        cy.get('input#unlock8').click();
        cy.get('span').contains('Envelope x solved').should('be.visible');
        cy.get('span').contains('Clues').should('be.visible');
    });
});
