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
        cy.contains('Item Designs');
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
        cy.get('h2').contains('Reputation').next().click();
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
        cy.get('h2').contains('Sanctuary').next().click();
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
        cy.get('h2').contains('Prosperity').next().click();
        cy.get('input#p-2').should('not.be.checked');
        cy.get('input#p-3').should('not.be.checked');
        cy.get('input#p-4').should('not.be.checked');
        cy.get('input#p-5').should('not.be.checked');
        cy.get('span').contains('015–021').prev().find('input').should('not.be.checked');
    });

    it('It stores the party sheet', () => {
        cy.visit('/tracker/#/party');
        cy.get('input[aria-labelledby="reputation"]').clear().type('20{enter}');
        cy.get('input[aria-labelledby="donations"]').clear().type('1000{enter}');
        cy.get('input#p-65').click();

        cy.get('#notes').type('Foo Bar');
        utilities.closeModel();

        cy.reload();

        cy.get('input[aria-labelledby="reputation"]').should('have.value', '20');
        cy.get('input[aria-labelledby="donations"]').should('have.value', '1000');
        cy.get('input#p-35').should('be.checked');
        cy.get('input#p-65').should('be.checked');
        cy.get('span').contains('064–070').prev().find('input').should('be.checked');
        cy.get('#notes').should('have.value', 'Foo Bar');
    });

});
