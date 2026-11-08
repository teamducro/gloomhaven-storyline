import utilities from "../utilities";

describe('Seeker of Xorn bonus content', () => {

    const chooseSeekerOfXorn = () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();
        utilities.scrollTo('60%');
        cy.get(`input[name="personal-quests"]`).type("510");
        cy.get('li').contains('#510 Seeker of Xorn').click();
    };

    const storedSheet = () => cy.window().then((win) => JSON.parse(win.localStorage.getItem(win.app.campaignId)).sheet);

    const disableSeekerOfXorn = () => {
        cy.visit('/tracker/#/settings');
        cy.get('#sox-enabled').uncheck();
    };

    it('It is off by default and keeps the bonus content out of campaigns', () => {
        // Given an existing campaign with a city event in the deck
        cy.visit('/tracker/#/party');
        cy.get('input[aria-labelledby="city-events"]').type('31');
        cy.get('li').contains('31').click();
        storedSheet().its('city').then((city) => {
            // When the Seeker of Xorn personal quest is chosen
            chooseSeekerOfXorn();

            // Then the stored event decks are untouched
            storedSheet().its('city').should('deep.equal', city);
        });

        // And the pack is off in the settings
        cy.visit('/tracker/#/settings');
        cy.get('#sox-enabled').should('not.be.checked');

        // And the bonus events can't be added to the city deck
        cy.visit('/tracker/#/party');
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

    it('It shows the bonus content in an existing campaign once enabled', () => {
        // Given a campaign that already holds the Seeker of Xorn personal quest
        chooseSeekerOfXorn();

        // When the pack is enabled
        utilities.enableGame('sox');

        // Then the bonus events can be added to the city deck
        cy.visit('/tracker/#/party');
        cy.get('input[aria-labelledby="city-events"]').type('SoX4');
        cy.get('li').contains('SoX4').click();
        cy.contains('#city-events-bedges .bedge', /^\s*SoX4\s*$/);

        // And the first bonus scenario is listed
        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('#SoX1').should('be.visible');
    });

    it('It adds City Event SoX1 to the deck when the Seeker of Xorn personal quest is chosen', () => {
        // Given the pack is enabled
        utilities.enableGame('sox');

        // When the Seeker of Xorn personal quest is chosen
        chooseSeekerOfXorn();

        // Then City Event SoX1 is in the city deck, and opens as a credited card
        cy.visit('/tracker/#/party');
        cy.contains('#city-events-bedges .bedge', /^\s*SoX1\s*$/).click();
        cy.get('h2').contains('City Event #SoX1');
        cy.get('img[alt="City Event #SoX1"]').should('be.visible');
        cy.contains('a', 'Fan-made bonus content by Morthai')
            .should('have.attr', 'href', 'https://boardgamegeek.com/thread/2220121/seeker-xorn-bonus-content');
    });

    it('It hides used bonus content when disabled, and restores it when enabled again', () => {
        // Given the pack was enabled, SoX1 shuffled in and the crypt completed
        utilities.enableGame('sox');
        chooseSeekerOfXorn();
        cy.visit('/tracker/#/achievements');
        cy.get('button').contains('add').click();
        cy.get('input[name=achievement-to-add]').type('Nobles');
        cy.get('li').contains('Nobles’ Crypt').click();
        cy.visit('/tracker/#/scenarios');
        cy.get('td').contains('#SoX1 Nobles’ Crypt').click({scrollBehavior: 'center'});
        cy.get('#scenario-content label').contains('Complete').click();
        utilities.closeModel();

        // When the pack is disabled
        disableSeekerOfXorn();

        // Then the campaign still loads without the bonus events
        cy.visit('/tracker/#/party');
        cy.get('#city-events-bedges .bedge').should('exist');
        cy.contains('#city-events-bedges .bedge', /SoX/).should('not.exist');
        cy.get('input[aria-labelledby="city-events"]').type('SoX');
        cy.get('li').contains('SoX').should('not.exist');

        // And without the bonus scenarios, even the completed one
        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('#1 Black Barrow');
        cy.get('#scenarios').contains('#SoX1').should('not.exist');

        // And without the earned bonus achievement
        cy.visit('/tracker/#/achievements');
        cy.get('#party-achievements').should('exist');
        cy.contains('#party-achievements', 'Nobles’ Crypt').should('not.exist');

        // And the used event is kept
        storedSheet().its('city.SoX1').should('equal', true);

        // When the pack is enabled again
        utilities.enableGame('sox');

        // Then the event is back in the deck and the crypt still complete
        cy.visit('/tracker/#/party');
        cy.contains('#city-events-bedges .bedge', /^\s*SoX1\s*$/);
        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('#SoX1').should('be.visible');
        utilities.scenarios().then((scenarios) => {
            expect(scenarios.firstWhere('id', 'SoX1').state).to.equal('complete');
        });
        cy.visit('/tracker/#/achievements');
        cy.contains('#party-achievements', 'Nobles’ Crypt');
    });

    it('It unlocks the first bonus crypt with its party achievement and completes it', () => {
        // Given the pack is enabled and the Seeker of Xorn personal quest is chosen
        utilities.enableGame('sox');
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
