import utilities from "../utilities";

describe('Crimson Scales scenarios', () => {

    beforeEach(() => {
        utilities.enableGame('cs');
        cy.visit('/tracker');
        utilities.switchGame('cs');
    });

    it('It lists the treasure of a scenario', () => {
        // Given scenarios 1 to 4 are complete so scenario 5 is unlocked
        [1, 2, 3, 4].forEach((id) => utilities.completeScenario(id));

        // When opening scenario 5 and showing its treasures
        utilities.openScenario(5);
        cy.get('button').contains('Show treasures').click();

        // Then treasure 45 is listed and shows its reward once looted
        cy.get('#treasure-45').parent().click();
        cy.get('#scenario-content').contains('One random “Stone” item (Item 94-100)');
    });

    it('It unlocks the add-on item design of a completed add-on scenario', () => {
        // Given add-on scenario AA1 is unlocked
        cy.window().then((win) => {
            const campaignData = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            campaignData['scenario-cs-AA1'] = {state: 'incomplete'};
            win.localStorage.setItem(win.app.campaignId, JSON.stringify(campaignData));
        });
        cy.reload();

        // When it is completed
        cy.visit('/tracker/#/scenarios');
        cy.get('td').contains('The Riches of the Steelsilk').click({scrollBehavior: 'center'});
        cy.get('#scenario-content label').contains('Complete').click();

        // Then the design of its reward "AA01" is stored under the data id, and the reward links to the item
        cy.window().its('app.campaignData.sheet-cs.itemDesigns').should('deep.eq', {aa01: true});
        cy.get('#scenario-content a').contains('Rockspine Bulwark').click();
        cy.get('.mdc-dialog--open').contains('Rockspine Bulwark');
    });

    it('It shows scenario 5 once complete', () => {
        // Given scenarios 1 to 5 are complete
        [1, 2, 3, 4, 5].forEach((id) => utilities.completeScenario(id));

        // When opening scenario 5
        utilities.openScenario(5);

        // Then the modal shows its content without a reward
        cy.get('.mdc-dialog--open').contains('Blood of the Oozes');
        cy.get('#scenario-content').contains('Reward').should('not.exist');
    });
});
