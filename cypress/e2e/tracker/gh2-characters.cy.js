import utilities from "../utilities";

describe('Gloomhaven 2nd Edition characters', () => {

    beforeEach(() => {
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');
    });

    it('It only offers the gh2 starting classes', () => {
        cy.visit('/tracker/#/characters');
        cy.get('.items-to-add-dropdown').click();

        ['Bruiser', 'Cragheart', 'Mindthief', 'Silent Knife', 'Spellweaver', 'Tinkerer']
            .forEach(name => cy.get('li.add-character').contains(name));
        cy.get('li.add-character').should('not.contain', 'Brute');
        cy.get('li.add-character').should('not.contain', 'Scoundrel');
    });

    it('It shows gh2 perks and masteries', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Bruiser');

        cy.contains('Each character gains advantage on their first attack');
        cy.contains('In 3 different scenarios, kill an enemy that you Pushed or Pulled that round');

        cy.get('#mastery-0').click({force: true});
        cy.contains('You may select an additional perk!');
    });

    it('It opens the gh2 character mat', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Bruiser');

        cy.get('#character-art').click();
        cy.get('#character-mat img[src*="character-mats/gh2/BR2-front"]').should('exist');
    });

    it('It applies gh2 perks to the attack modifier deck', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Bruiser');

        // Replace -1 with +1 (image cards only), add +3 and replace +0 with +0 stun (text cards)
        cy.get('#perk-0-0').click({force: true});
        cy.get('#perk-6-0').click({force: true});
        cy.get('#perk-3-0').click({force: true});

        cy.get('#open-modifier-deck').click({force: true});
        cy.contains('Attack Modifier Deck');

        // 7 base codes + plus3 + plus0_stun
        utilities.assertCount('.mdc-dialog__content ul.grid li', 9);
        cy.get('.mdc-dialog__content ul.grid li').contains('1x');
    });

    it('It shows gh2 ability cards', () => {
        cy.visit('/tracker/#/characters');
        utilities.openAbilities('Bruiser');

        cy.get('img[src*="/img/abilities/gh2/BR2/trample"]').should('exist');
        // 10 level 1 + 3 level X, like Cragheart's 11 + 3 in abilities.cy.js
        utilities.assertCount('.ability-card.available', 13);
    });

    it('It prices gh2 enhancements with the GH2e table', () => {
        cy.visit('/tracker/#/characters');
        utilities.openAbilities('Bruiser');
        cy.get('#desktop-enable-enhancements').check();
        cy.get('#available-trample').closest('.ability-card').click();
        cy.get('.ability-modal').contains('button', 'Enhance').click();

        cy.get('#enhancement-type').select('target');
        cy.get('.ability-modal').contains('Cost: 75 Gold');
        cy.get('#enhancement-type option[value="regenerate"]').should('not.exist');
        cy.get('.ability-modal option[value="persistent"]').should('not.exist');
    });
    it('It applies replaceCount and null cards in the gh2 deck', () => {
        cy.visit('/tracker/#/party');
        cy.get('#character-SS2').check({force: true});
        cy.get('#character-NS2').check({force: true});

        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Soothsinger');
        // Replace one +0 and one +1 with two +2: base +0 6->5, +1 5->4, +2 1->3
        cy.get('#perk-4-0').click({force: true});
        cy.get('#open-modifier-deck').click({force: true});
        utilities.assertCount('.mdc-dialog__content ul.grid li', 7);
        cy.get('.mdc-dialog__content ul.grid li').contains('3x');
        utilities.closeModel();

        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Nightshroud').click();
        // Replace the null card with a -2: the deck loses its null card, -2 goes to 2x
        cy.get('#perk-3-0').click({force: true});
        cy.get('#open-modifier-deck').click({force: true});
        utilities.assertCount('.mdc-dialog__content ul.grid li', 6);
        cy.get('.mdc-dialog__content ul.grid li').contains('2x');
    });

    it('It does not offer gh2 classes in a Gloomhaven campaign', () => {
        utilities.chooseEdition('gh');
        cy.visit('/tracker/#/characters');
        cy.get('.items-to-add-dropdown').click();

        cy.get('li.add-character').contains('Brute');
        cy.get('li.add-character').should('not.contain', 'Bruiser');
    });
});
