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
});
