import utilities from "../utilities";

const state = (id) => utilities.scenarios().then((s) => s.firstWhere('id', id).state);
const openIntoTheBlack = () => {
    cy.visit('/tracker/#/scenarios');
    cy.get('td').contains('#102 Into the Black').click({scrollBehavior: 'center'});
};

describe('FH scenarios', () => {
    beforeEach(() => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
    });

    it('keeps The Lead Door hidden when Into the Black is completed without looting treasure #57', () => {
        cy.visit('/tracker?states=99_c-100_c-101_c-102_c');
        state(103).should('eq', 'hidden');
    });

    it('unlocks The Lead Door when treasure #57 is looted in Into the Black', () => {
        cy.visit('/tracker?states=99_c-100_c-101_c-102_c');
        openIntoTheBlack();
        cy.get('#treasure-57').click();
        utilities.closeModel();
        state(103).should('eq', 'incomplete');
    });

    it('keeps a completed The Lead Door of a campaign that did not mark treasure #57', () => {
        cy.visit('/tracker?states=99_c-100_c-101_c-102_c-103_c');
        state(103).should('eq', 'complete');
    });

    it('keeps a completed The Lead Door when treasure #57 is unchecked', () => {
        cy.visit('/tracker?states=99_c-100_c-101_c-102_c-103_c');
        openIntoTheBlack();
        cy.get('#treasure-57').click();
        cy.get('#treasure-57').click();
        utilities.closeModel();
        state(103).should('eq', 'complete');
    });

    it('keeps The Lead Door of a campaign that unlocked it before treasure #57 did', () => {
        // Seed from the website page, the running tracker would overwrite the data
        cy.visit('/');
        cy.window().then((win) => {
            const campaignData = JSON.parse(win.localStorage.getItem('local')) || {};
            [99, 100, 101, 102].forEach(id => campaignData[`scenario-fh-${id}`] = {state: 'complete'});
            campaignData['scenario-fh-103'] = {state: 'incomplete'};
            win.localStorage.setItem('local', JSON.stringify(campaignData));
        });
        cy.visit('/tracker');

        state(103).should('eq', 'incomplete');
        utilities.scenarios().then((s) => expect(s.firstWhere('id', 102).unlockedTreasures).to.include(57));
    });
});
