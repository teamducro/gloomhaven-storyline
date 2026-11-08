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
        openScenario('Jaskinia Trupów');

        cy.get('#scenario-content a').contains('Większa Mikstura Wytrzymałości').click();

        cy.get('.mdc-dialog--open').contains('Większa Mikstura Wytrzymałości');
    });

    it('It links items in Hungarian texts with a non-ASCII item label', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-7_c-8_c-9_c-13_c', {
            onBeforeLoad: (win) => win.localStorage.setItem('lang', '"hu"')
        });
        openScenario('Hullabarlang');

        cy.get('#scenario-content a').contains('Nagy serkentő ital').click();

        cy.get('.mdc-dialog--open').contains('Nagy serkentő ital');
    });

    [
        ['ru', 'Пещера трупов', 'Большое зелье выносливости', '«» quotes'],
        ['zh', '尸体洞窟', '强效耐力药水', 'full-width parentheses'],
        ['th', 'ถ้ำศพ', 'ยาคงทนหลัก', 'combining marks in the item label'],
    ].forEach(([lang, scenario, item, form]) => {
        it(`It links items in ${lang} texts with ${form}`, () => {
            cy.visit('/tracker?states=1_c-2_c-3_c-7_c-8_c-9_c-13_c', {
                onBeforeLoad: (win) => win.localStorage.setItem('lang', `"${lang}"`)
            });
            openScenario(scenario);

            cy.get('#scenario-content a').contains(item).click();

            cy.get('.mdc-dialog--open').contains(item);
        });
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

    it('It removes the Gloomhaven items that older campaigns unlocked as Crimson Scales designs', () => {
        // Given designs 12, 20 and 86 from completed scenarios 8, 10 and 14, before their rewards named the right items
        cy.visit('/tracker/#/items');
        cy.window().then((win) => {
            const campaignData = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            campaignData['sheet-cs'] = {itemDesigns: {12: true, 20: true, 86: true}};
            [8, 10, 14].forEach(id => campaignData['scenario-cs-' + id] = {state: 'complete'});
            delete campaignData['migrated-cs-designs-sheet-cs'];
            win.localStorage.setItem(win.app.campaignId, JSON.stringify(campaignData));
        });

        // When the campaign loads
        cy.reload();

        // Then 12 (a Gloomhaven potion) and 86 are gone, 20 stays as scenario 8's reward and 88 is scenario 14's
        cy.window().then((win) => {
            const sheet = win.app.campaignData['sheet-cs'];
            expect(sheet.itemDesigns).to.deep.eq({20: true, 88: true});
            expect(win.app.campaignData['migrated-cs-designs-sheet-cs']).to.be.true;
        });
    });
});
