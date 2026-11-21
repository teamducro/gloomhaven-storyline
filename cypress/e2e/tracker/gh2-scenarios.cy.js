import utilities from "../utilities";

const state = (id) => utilities.scenarios().then((s) => s.firstWhere('id', id).state);
const awarded = (id) => utilities.achievements().then((a) => a.firstWhere('id', id).awarded);
const complete = (label, option) => {           // label as shown in the list, e.g. '#13 Icecrag Ascent'
    cy.visit('/tracker/#/scenarios');
    cy.get('td').contains(label).click({scrollBehavior: 'center'});
    cy.get('#scenario-content label').contains('Complete').click();
    if (option) {
        cy.get('label').contains(option).click();
        cy.get('.mdc-dialog--open button').contains('Choose').click();
    }
    utilities.closeModel();
};

describe('GH2 scenarios', () => {
    beforeEach(() => {
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');
    });

    it('starts with the root scenarios', () => {
        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('#0 Training Course');
        cy.get('#scenarios').contains('#1 Bandit Camp');
        state(2).should('eq', 'hidden');
    });

    it('unlocks the next scenario', () => {
        cy.visit('/tracker');
        complete('#1 Bandit Camp');
        state(2).should('eq', 'incomplete');
    });

    it('awards a global achievement', () => {
        cy.visit('/tracker?states=1_c-2_c');
        complete('#3 Frozen Hollow');
        awarded('G2TPE').should('eq', true);
        state(4).should('eq', 'incomplete');
        state(5).should('eq', 'incomplete');
    });

    it('requires a reputation threshold', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-5_c-10_c');
        state(17).should('eq', 'required');
        cy.visit('/tracker/#/achievements');
        cy.get('button').contains('add').click();
        cy.get('input[name=achievement-to-add]').type('Military Rep');
        cy.get('li').contains('Military Reputation 6').click();
        cy.visit('/tracker/#/scenarios');
        cy.reload();
        state(17).should('eq', 'incomplete');
    });

    it('unlocks by conclusion section', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-5_c-10_c');
        complete('#13 Icecrag Ascent', 'Section 51.1');
        state(29).should('eq', 'incomplete');
        state(32).should('eq', 'hidden');
        awarded('G2TDA').should('eq', false);
    });

    it('blocks a scenario through a conclusion achievement', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-5_c-10_c');
        complete('#13 Icecrag Ascent', 'Section 18.3');
        state(29).should('eq', 'incomplete');
        complete('#32 Savvas Armory', 'Section 78.6');
        awarded('G2TDA').should('eq', true);
        state(29).should('eq', 'blocked');
    });

    it('keeps a scenario complete that is unlocked by two prompt scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-5_c-10_c-14_c');
        complete('#13 Icecrag Ascent', 'Section 18.3');
        state(31).should('eq', 'incomplete');
        complete('#32 Savvas Armory', 'Section 81.5');
        state(32).should('eq', 'complete');
        cy.reload();
        state(32).should('eq', 'complete');
        state(33).should('eq', 'incomplete');
    });

    it('blocks scenarios after Realm of the Voice', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-5_c-10_c-14_c-30_c');
        complete('#35 Realm of the Voice');
        state(31).should('eq', 'blocked');
    });

    it('shows the printed number of variant scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-4_c-6_c-11_c-19_c-20_c-26_c');
        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('#23A Gloomhaven Square A (Demon Allies)');
    });

    it('starts with An Uneasy Peace', () => {
        cy.visit('/tracker');
        awarded('G2AUP').should('eq', true);
    });

    it('replaces the city rule when another one is gained', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-4_c-6_c-11_c-19_c-20_c-26_c');
        awarded('G2AUP').should('eq', true);
        complete('#23A Gloomhaven Square A (Demon Allies)');
        awarded('G2CRD').should('eq', true);
        awarded('G2AUP').should('eq', false);
    });

    it('shows the requirements of the opened scenario after another one', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-4_c-5_c-6_c-10_c-11_c-17_c-19_c-20_c');
        cy.visit('/tracker/#/scenarios');
        cy.get('td').contains('#26 ').click({scrollBehavior: 'center'});
        cy.get('#scenario-content').contains('Military Outpost');
        utilities.closeModel();

        cy.get('td').contains('#23B ').click({scrollBehavior: 'center'});
        cy.get('#scenario-content').contains('Demonic Rift');
        cy.get('#scenario-content').contains('Investigation');
        cy.get('#scenario-content').should('not.contain', 'Military Outpost');
    });
});
