import utilities from "../utilities";

describe('Seeker of Xorn bonus content', () => {

    it('It adds City Event SoX1 to the deck when the Seeker of Xorn personal quest is chosen', () => {
        // Given a character without a personal quest
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();
        utilities.scrollTo('60%');

        // When the Seeker of Xorn personal quest is chosen
        cy.get(`input[name="personal-quests"]`).type("510");
        cy.get('li').contains('#510 Seeker of Xorn').click();

        // Then City Event SoX1 is in the city deck, and opens as a card
        cy.visit('/tracker/#/party');
        cy.contains('#city-events-bedges .bedge', /^\s*SoX1\s*$/).click();
        cy.get('h2').contains('City Event #SoX1');
        cy.get('img[alt="City Event #SoX1"]').should('be.visible');
    });

    it('It can add the other bonus events to the city deck', () => {
        // Given a party sheet
        cy.visit('/tracker/#/party');

        // When SoX4 is added from the city events
        cy.get('input[aria-labelledby="city-events"]').type('SoX4');
        cy.get('li').contains('SoX4').click();

        // Then it is in the deck
        cy.contains('#city-events-bedges .bedge', /^\s*SoX4\s*$/);
    });

    it('It unlocks the first bonus crypt with its party achievement and completes it', () => {
        // Given the first crypt is not unlocked yet
        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('#SoX1').should('be.visible');
        cy.get('#scenarios').contains('Nobles’ Crypt').should('not.exist');

        // When the party gains the achievement from City Event SoX1
        cy.visit('/tracker/#/achievements');
        cy.get('button').contains('add').click();
        cy.get('input[name=achievement-to-add]').type('Nobles');
        cy.get('li').contains('Nobles’ Crypt').click();

        // Then the crypt can be completed and lists its rewards
        cy.visit('/tracker/#/scenarios');
        cy.get('td').contains('#SoX1 Nobles’ Crypt').click({scrollBehavior: 'center'});
        cy.get('#scenario-content label').contains('Complete').click();
        cy.contains('Add City Event SoX2 to the deck');
        utilities.closeModel();

        cy.get('#scenarios').contains('#SoX2 Flooded Crypt').should('not.exist');
        utilities.scenarios().then((scenarios) => {
            expect(scenarios.firstWhere('id', 'SoX1').state).to.equal('complete');
        });
    });
});
