import utilities from "../utilities";

describe('Seeker of Xorn bonus content', () => {

    const chooseSeekerOfXorn = () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();
        utilities.scrollTo('60%');
        cy.get(`input[name="personal-quests"]`).type("510");
        cy.get('li').contains('#510 Seeker of Xorn').click();
    };

    it('It keeps the bonus content out of campaigns without the Seeker of Xorn personal quest', () => {
        // Given a campaign without the Seeker of Xorn personal quest
        cy.visit('/tracker/#/party');

        // Then the bonus events can't be added to the city deck
        cy.get('input[aria-labelledby="city-events"]').type('SoX');
        cy.get('li').contains('SoX').should('not.exist');

        // And the bonus scenarios aren't listed
        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('#1 Black Barrow');
        cy.get('#scenarios').contains('#SoX1').should('not.exist');

        // And their party achievements can't be gained
        cy.visit('/tracker/#/achievements');
        cy.get('button').contains('add').click();
        cy.get('input[name=achievement-to-add]').type('Nobles');
        cy.get('li').contains('Nobles’ Crypt').should('not.exist');
    });

    it('It adds City Event SoX1 to the deck when the Seeker of Xorn personal quest is chosen', () => {
        // When the Seeker of Xorn personal quest is chosen
        chooseSeekerOfXorn();

        // Then City Event SoX1 is in the city deck, and opens as a credited card
        cy.visit('/tracker/#/party');
        cy.contains('#city-events-bedges .bedge', /^\s*SoX1\s*$/).click();
        cy.get('h2').contains('City Event #SoX1');
        cy.get('img[alt="City Event #SoX1"]').should('be.visible');
        cy.contains('a', 'Fan-made bonus content by Morthai')
            .should('have.attr', 'href', 'https://boardgamegeek.com/thread/2220121/seeker-xorn-bonus-content');
        utilities.closeModel();

        // And the other bonus events can be added
        cy.visit('/tracker/#/party');
        cy.get('input[aria-labelledby="city-events"]').type('SoX4');
        cy.get('li').contains('SoX4').click();
        cy.contains('#city-events-bedges .bedge', /^\s*SoX4\s*$/);
    });

    it('It unlocks the first bonus crypt with its party achievement and completes it', () => {
        // Given the Seeker of Xorn personal quest is chosen
        chooseSeekerOfXorn();
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
