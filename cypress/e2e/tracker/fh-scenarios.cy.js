import utilities from "../utilities";

const state = (id) => utilities.scenarios().then((s) => s.firstWhere('id', id).state);
const complete = (label, option) => {           // label as shown in the list, e.g. '#102 Into the Black'
    cy.visit('/tracker/#/scenarios');
    cy.get('td').contains(label).click({scrollBehavior: 'center'});
    cy.get('#scenario-content label').contains('Complete').click();
    if (option) {
        cy.get('label').contains(option).click();
        cy.get('.mdc-dialog--open button').contains('Choose').click();
    }
    utilities.closeModel();
};

describe('FH scenarios', () => {
    beforeEach(() => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
    });

    it('unlocks The Lead Door when the condition was fulfilled in Into the Black', () => {
        cy.visit('/tracker?states=99_c-100_c-101_c');
        complete('#102 Into the Black', 'Yes');
        state(103).should('eq', 'incomplete');
    });

    it('keeps The Lead Door hidden when the condition was not fulfilled in Into the Black', () => {
        cy.visit('/tracker?states=99_c-100_c-101_c');
        complete('#102 Into the Black', 'No');
        state(102).should('eq', 'complete');
        state(103).should('eq', 'hidden');
    });

    it('keeps The Lead Door of a campaign that completed it before the prompt existed', () => {
        cy.visit('/tracker?states=99_c-100_c-101_c-102_c-103_c');
        state(103).should('eq', 'complete');
        cy.reload();
        state(103).should('eq', 'complete');
    });
});
