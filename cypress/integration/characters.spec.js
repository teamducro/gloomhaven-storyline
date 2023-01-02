import utilities from "../utilities";

describe('Character', () => {

    it('It loads the character sheet', () => {
        cy.visit('/tracker/#/characters');

        cy.get('input[name="name"]').should('have.value', 'Brute');
        cy.contains('Perks');
        cy.contains('Remove two cards');
        cy.contains('Items');
        cy.contains('Battle Goals');
        cy.contains('Additional notes');
        cy.contains('Retire');
    });

    it('It can add a character', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        cy.contains('Ignore negative scenario effects');
    });

    it('It can have one character in a party at the time', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Cragheart').contains('Cragheart').parent().should('have.class', 'grayscale');
    });

    it('It can change the character name', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        cy.get('input[name="name"]').clear().type("Test").blur();
        cy.get('li').contains('Test').should('be.visible');
    });

    it('It can change level, xp and gold', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        // LVL
        cy.contains('Lvl 2');
        cy.contains('45 XP');
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('2{enter}');
        cy.contains('Lvl 3');
        cy.contains('95 XP');

        // XP
        cy.get('input[aria-labelledby="xp"]').clear({force: true}).type('100{enter}');
        cy.contains('Level up when you\'re back in town!');

        // Gold
        cy.get('input[aria-labelledby="gold"]').clear({force: true}).type('20{enter}');
    });

    it('It can add items', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        // Show first 10 items by default, can add them without typing anything
        cy.get('input[name="items"]').click();
        cy.get('li').contains('Boots of Striding').click();
        utilities.closeModel();
        cy.get('#items-bedges').contains('Boots of Striding');

        // Search items by their name
        cy.get('input[name="items"]').click().type('Minor');
        cy.get('li').contains('Minor Healing Potion').click();
        utilities.closeModel();
        cy.get('#items-bedges').contains('Minor Healing Potion');

        // Search items by their id
        cy.get('input[name="items"]').click().clear().type('11{enter}');
        cy.get('li').contains('Poison Dagger').click();
        utilities.closeModel();
        cy.get('#items-bedges').contains('Poison Dagger');
    });

    it('It can check perks', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        for (let i = 0; i <= 9; i++) {
            cy.get(`#perk-${i}-0`).click();
        }
    });

    it('It can check battle goals', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');

        for (let i = 1; i <= 3; i++) {
            cy.get(`#check${i}`).click();
        }
        cy.contains('You may select an additional perk!');

    });

    it('It can\'t add more items then there is stock', () => {
        // Campaign with Brute and Cragheart #001 Boots of Striding
        cy.visit('/tracker/#/shared/1/local/N4Rozg5gFgtAjAIgFyjAFxASwL4BpwBmAxjAJwBsyqGO+YUwCAhgE5FSYBuApgCYDCUVkyJpuLMFTwJ2w0eICqAOwA2AeyIBrSSgQAhAErIQcXAn4AJY6YQBlAOrWzAFQCSTu-w8BZZ9bwgsowALADMABxE4XCkwTAEoXBxwXBw4TAARrxw5DAA7OThAAykBMFE5EwZecj6RmahRTHBTOR5MERMebwwwQBMRNwwTKVwMMXlTMHcGX3cYbWWCNJEmGgAnlQIiEgmZn0eoR7BHgCsHpS7NjVXZuEepB5wRU87e9sHt9tHX0lP579Lu84Ddgfdfo8vn0XlC3jY+p93n0fkiTlCAUigfDQfDwUjIe9Gv58JheMAAgAHTA2FhqJi8LZw-aHY5nC4eHF3B5PGHApkfJ4omx-X4Y4VYswgp544UE+G8+H8hEeZEqtFIsX7CUIPqcnUy-ZyhoKgIAV3JKyELBEYhYvQiUWa8USyVS6SyOXyhRKZQqVRujHY3C0OnJZggahUDKQRTMpNqhgQcbEAFtQ9tiQgVNweCpkDYlEwU9wEyxTWIkwgKeJtFsYQBtEBFAC6kuQjZbzKQHfwnYQPw7rYQaJ7TaHAMHZkuo77N0nCHBM6HkPnz3bY+kptN8aQw4d0VizqSvTdmWyuQKxVK5Uq1UrAA8Kcgipa5LaYI1mq12p1ur0BkMIwEGMEydNMszzD8gZQMGtYoNIEZRs+cbRuYVjJtwaaMpm2a5vmZiFsWizWtA3CsGglbViwcGMA2Y5tt2Ta9r2Q6fPOA5MfRw7rrGXETlx06cbOPFDouXErhuZhbju-ZNLE34dF0PT9IMwyjOMRSTOBcwLGYj7Ptg2BAA/characters');

        utilities.openCharacter('Spellweaver');

        cy.get('input[name="items"]').click();
        cy.get('li').contains('Boots of Striding').click().parent().parent().should('have.class', 'opacity-50');

        cy.get('#items-bedges').contains('Boots of Striding').should('not.exist');
    });

    it('It can track personal quests', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');

        cy.get(`input[name="personal-quests"]`).type("510");
        cy.get('li').contains('#510 Seeker of Xorn').click();

        cy.get(`input[name="personal-quests"]`).should('not.exist');
        cy.contains('Complete three Crypt scenarios.');

        cy.get('#pq-0-0').click();
        cy.get('button').contains('Remove #510');
        cy.get('p').contains('Unlocked').should('not.exist');
        cy.get('span').contains('Conclude Hidden Scenario');

        cy.get('#pq-0-1').click();
        cy.get('#pq-0-2').click();
        cy.get('span').contains('Conclude 52 Noxious Cellar');
        cy.get('span').contains('Conclude Hidden Scenario').should('not.exist');
        cy.get('#pq-0-2').click();
        cy.get('#pq-0-2').click();
        cy.get('#pq-1-0').click();
        cy.get('p').contains('Unlocked');
    });

    it('It can open solo scenario', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');
        cy.get('span').contains('Stone Defense').click();

        cy.get('#scenario-content label').contains('Complete').click();
        utilities.closeModel();
    });

    it('It can draw a random personal quest', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');

        cy.get('button').contains('Draw').click();

        cy.get(`input[name="personal-quests"]`).should('not.exist');
    });

    it('It opens personal quest card', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');

        cy.get(`input[name="personal-quests"]`).click();
        cy.get('li').contains('#510 Seeker of Xorn').click();

        cy.get('img[alt="Seeker of Xorn"]').click();
        cy.get('h2').contains('Personal Quest #510');
    });

    it('It can track retirements', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('80%');

        let message = 'You may select an additional perk!';

        cy.get('p').contains(message).should('not.exist');

        cy.get(`input[aria-labelledby="level"]`).clear({force: true}).type('2{enter}');

        cy.get('p').contains(message).should('exist');

        cy.get(`input[aria-labelledby="retirements"]`).clear({force: true}).type('1{enter}');

        cy.get('p').contains(message).should('exist');

        cy.get('#perk-8-0').click({force: true});

        cy.get('p').contains(message).should('exist');

        cy.get('#perk-9-0').click();

        cy.get('p').contains(message).should('not.exist');
    });

    it('It stores the character sheet', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();

        cy.get('input[name="name"]').clear().type("Test");
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('2{enter}');
        cy.get('input[aria-labelledby="xp"]').clear({force: true}).type('50{enter}');
        cy.get('input[aria-labelledby="gold"]').clear({force: true}).type('50{enter}');
        cy.get('#perk-0-0').click({force: true});
        cy.get('input[name="items"]').click();
        cy.get('li').contains('Boots of Striding').click();
        utilities.closeModel();
        utilities.scrollTo('60%');
        cy.get('#check1').click();
        cy.get('#notes').type('Foo Bar');
        utilities.closeModel();
        cy.get(`input[name="personal-quests"]`).click();
        cy.get('li').contains('#510 Seeker of Xorn').click();
        cy.get('#pq-0-0').click();
        cy.get('input[aria-labelledby="retirements"]').clear({force: true}).type('2{enter}');

        cy.reload();

        cy.get('input[name="name"]').should('have.value', 'Test');
        cy.get('input[aria-labelledby="level"]').should('have.value', '2');
        cy.get('input[aria-labelledby="xp"]').should('have.value', '50');
        cy.get('input[aria-labelledby="gold"]').should('have.value', '50');
        cy.get('#check1').should('be.checked');
        cy.get('#perk-0-0').should('be.checked');
        cy.get('#notes').should('have.value', 'Foo Bar');
        cy.get('h3').contains('#510 Seeker of Xorn');
        cy.get('#pq-0-0').should('be.checked');
        cy.get('input[aria-labelledby="retirements"]').should('have.value', '2');
    });

});
