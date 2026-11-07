import utilities from "../utilities";

describe('Crimson Scales cross-game items', () => {

    beforeEach(() => {
        utilities.enableGame('cs');
        utilities.switchGame('cs');
    });

    const openScenario = (name) => {
        cy.visit('/tracker/#/scenarios');
        cy.get('td').contains(name).click({scrollBehavior: 'center'});
    };

    it('It opens the Gloomhaven item from a Crimson Scales scenario reward', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-7_c-8_c-9_c-13_c');
        openScenario('Corpse Cavern');

        cy.get('#scenario-content a').contains('Major Stamina Potion').click();

        cy.get('.mdc-dialog--open').contains('Major Stamina Potion');
        cy.get('.mdc-dialog--open').contains('Claw Trap').should('not.exist');
    });

    it('It links items in Polish texts that open quotes with „', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-7_c-8_c-9_c-13_c', {
            onBeforeLoad: (win) => win.localStorage.setItem('lang', '"pl"')
        });
        openScenario('Corpse Cavern');

        cy.get('#scenario-content a').contains('Major Stamina Potion').click();

        cy.get('.mdc-dialog--open').contains('Major Stamina Potion');
    });

    it('It links items in Hungarian texts with a non-ASCII item label', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-7_c-8_c-9_c-13_c', {
            onBeforeLoad: (win) => win.localStorage.setItem('lang', '"hu"')
        });
        openScenario('Corpse Cavern');

        cy.get('#scenario-content a').contains('Major Stamina Potion').click();

        cy.get('.mdc-dialog--open').contains('Major Stamina Potion');
    });

    it('It only unlocks the Crimson Scales item designs for rewards of the Crimson Scales item deck', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-7_c-8_i-10_i');

        // Item 20 is Curious Pendant in Crimson Scales.
        openScenario('Shattered Fortress');
        cy.get('#scenario-content label').contains('Complete').click();
        utilities.closeModel();

        // Items 12 and 20 are Gloomhaven potions here, so they must not unlock Crimson Scales designs again.
        openScenario('Den of Monstrosity');
        cy.get('#scenario-content label').contains('Complete').click();

        cy.window().then((win) => {
            const itemDesigns = win.app.campaignData['sheet-cs'].itemDesigns;
            expect(itemDesigns).to.have.property('20', true);
            expect(itemDesigns).to.not.have.property('12');
        });
    });
});
