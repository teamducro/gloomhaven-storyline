import utilities from "../utilities";

describe('Mercenary Pack', () => {

    it('It completes a Mercenary Pack solo scenario and unlocks its reward item', () => {
        // Unlock Anaphi so her name (not just her icon) shows up in the add-character dropdown.
        cy.visit('/tracker/#/party');
        utilities.scrollTo('100%', true);
        cy.get('#character-AN').click();

        // Adding her to the party also satisfies the solo scenario's unlock check.
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Anaphi');
        utilities.scrollTo('60%');

        cy.get('span').contains('A Harrowing Deal').click();
        cy.get('#scenario-content label').contains('Complete').click();
        utilities.closeModel();

        // The reward item is merged into the current game's item pool and unlocked automatically.
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Ribbon of Friendship');
    });

    it('It shows the other Mercenary Pack characters\' solo scenario reward items in the items list', () => {
        const characters = [
            {code: 'SA', name: 'Satha', scenario: 'Horns in the Night', items: ['Crest of Frosthaven']},
            {code: 'CA', name: 'Cassandra', scenario: 'Escape from Corruption', items: ['Basin of Prophecy A', 'Basin of Prophecy B']},
            {code: 'HA', name: 'Hail', scenario: 'Major Annoyance', items: ['No Nonsense Boots']},
        ];

        characters.forEach(({code, name, scenario, items}) => {
            // Unlock the character so their name (not just their icon) shows up in the add-character dropdown.
            cy.visit('/tracker/#/party');
            utilities.scrollTo('100%', true);
            cy.get('#character-' + code).click();

            // Adding them to the party also satisfies the solo scenario's unlock check.
            cy.visit('/tracker/#/characters');
            utilities.openCharacter(name);
            utilities.scrollTo('60%');

            cy.get('span').contains(scenario).click();
            cy.get('#scenario-content label').contains('Complete').click();
            utilities.closeModel();

            // The reward item(s) are merged into the current game's item pool and unlocked automatically.
            cy.visit('/tracker/#/items');
            items.forEach((item) => cy.get('#items').contains(item));
        });
    });

    it('It only shows Mercenary Pack solo scenarios in the list when the pack is enabled and the character is in the party', () => {
        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('A Harrowing Deal').should('not.exist');

        // Not in the party yet: still hidden even though the pack is enabled.
        cy.visit('/tracker/#/party');
        utilities.scrollTo('100%', true);
        cy.get('#character-AN').click();

        cy.visit('/tracker/#/scenarios');
        utilities.scrollTo('100%', true);
        cy.get('#scenarios').contains('A Harrowing Deal').should('not.exist');

        // Add her to the party: now it shows.
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Anaphi');

        cy.visit('/tracker/#/scenarios');
        utilities.scrollTo('100%', true);
        cy.get('#scenarios').contains('A Harrowing Deal').should('exist');

        // Disable the pack: hidden again, even though she's still in the party.
        cy.visit('/tracker/#/settings');
        cy.get('#mp-enabled').uncheck();

        cy.visit('/tracker/#/scenarios');
        utilities.scrollTo('100%', true);
        cy.get('#scenarios').contains('A Harrowing Deal').should('not.exist');
    });

    it('It can select the Mercenary Pack reward item on the character page after completing the solo scenario', () => {
        cy.visit('/tracker/#/party');
        utilities.scrollTo('100%', true);
        cy.get('#character-AN').click();

        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Anaphi');
        utilities.scrollTo('60%');

        cy.get('span').contains('A Harrowing Deal').click();
        cy.get('#scenario-content label').contains('Complete').click();
        utilities.closeModel();

        // Reload so the character sheet's item catalog picks up the newly unlocked item.
        cy.reload(true);

        cy.get('input[name="items"]').click().type('Ribbon');
        cy.get('li').contains('Ribbon of Friendship').click();
        utilities.closeModel();
        cy.get('#items-bedges').contains('Ribbon of Friendship');
    });
});
