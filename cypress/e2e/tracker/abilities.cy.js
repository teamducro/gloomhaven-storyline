import utilities from "../utilities";

describe('Abilities', () => {

    it('It loads a characters abilities', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('h1').contains('Local Campaign Cragheart Abilities');
    });

    it('It can add/remove abilities to/from the deck', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('#deck-avalanche').should('not.exist');

        cy.get('#available-avalanche').click();

        cy.get('#deck-avalanche').should('exist');

        cy.get('#deck-avalanche').click();

        cy.get('#deck-avalanche').should('not.exist');
    });

    it('It only offers Crimson Scales milestone cards once the milestone is achieved', () => {
        utilities.enableGame('cs');
        utilities.switchGame('cs');
        cy.visit('/tracker/#/characters');

        utilities.openAbilities('Fire Knight');

        cy.get('#available-improvised-methods').should('not.exist');
        cy.get('#available-fiery-charisma').should('exist');

        cy.get('#desktop-milestone-achieved').click();

        cy.get('#available-improvised-methods').should('exist');
        cy.get('img[src*="/img/abilities/cs/FK/improvised-methods"]').scrollIntoView().should('have.prop', 'naturalWidth').and('be.greaterThan', 0);

        cy.get('#available-improvised-methods').click();
        cy.get('#deck-improvised-methods').should('exist');

        cy.get('#desktop-milestone-achieved').click();

        cy.get('#available-improvised-methods').should('not.exist');
        cy.get('#deck-improvised-methods').should('not.exist');
        cy.get('.deck-header h2').contains('Deck 0 /');
    });

    it('It keeps a milestone card that was in the deck before the milestone flag existed', () => {
        utilities.enableGame('cs');
        utilities.switchGame('cs');
        cy.visit('/tracker/#/characters');
        utilities.openAbilities('Fire Knight');
        cy.get('#desktop-milestone-achieved').click();
        cy.get('#available-improvised-methods').click();

        utilities.store().then((store) => {
            const campaign = JSON.parse(store.getItem('local'));
            Object.keys(campaign).filter(key => key.startsWith('character-')).forEach(key => delete campaign[key].milestone);
            store.setItem('local', JSON.stringify(campaign));
        });
        cy.reload();
        cy.get('#desktop-character-menu').contains('Abilities').click();

        cy.get('#deck-improvised-methods').should('exist');
        cy.get('#desktop-milestone-achieved').should('be.checked');
    });

    it('It can show all abilities', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        utilities.assertCount('.ability-card.available', 14);

        utilities.scrollTo(0);
        cy.get('#desktop-show-all-abilities').click({scrollBehavior: false});

        utilities.assertCount('.ability-card.available', 30);
    });

    it('It can sort abilities', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('.ability-card.available:first-child #available-unstable-upheaval').should('not.exist');

        cy.get('#ability-sort-dropdown button').click();
        cy.get('#ability-sort-dropdown span').contains('initiative arrow_upward').click();

        cy.get('.ability-card.available:first-child #available-unstable-upheaval').should('exist');
    });

    it('It can toggle sides', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('#available-avalanche').click();

        cy.get('.available-header .material-icons').contains('content_copy').should('exist');
        cy.get('.available-header .material-icons').contains('grid_view').should('not.exist');
        cy.get('.deck-header .material-icons').contains('content_copy').should('not.exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('exist');

        cy.get('.available-header .side-toggle').click();

        cy.get('.available-header .material-icons').contains('content_copy').should('not.exist');
        cy.get('.available-header .material-icons').contains('grid_view').should('exist');
        cy.get('.deck-header .material-icons').contains('content_copy').should('exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('not.exist');

        cy.get('.deck-header .side-toggle').click();

    });

    it('It shows three columns of cards on the wide side', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('.available-header').next().should(($grid) => {
            expect(getComputedStyle($grid[0]).gridTemplateColumns.split(' ')).to.have.length(3);
        });
    });

    it('It can collapse the grid', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('.available-header .material-icons').contains('grid_view').should('not.exist');
        cy.get('.available-header .material-icons').contains('content_copy').click();
        cy.get('.available-header .material-icons').contains('grid_view').should('exist');
        cy.get('.available-header .material-icons').contains('content_copy').should('not.exist');

        cy.get('.deck-header .material-icons').contains('content_copy').should('not.exist');
        cy.get('.deck-header .material-icons').contains('grid_view').click();
        cy.get('.deck-header .material-icons').contains('content_copy').should('exist');
        cy.get('.deck-header .material-icons').contains('grid_view').should('not.exist');
    });

    it('It can\'t manage abilities at level 1', () => {
        cy.visit('/tracker/#/characters');

        utilities.openAbilities();

        cy.get('button').contains('Manage').click();

        cy.get('h2').contains('Manage abilities for each level');
        cy.get('p').contains('Please level Cragheart first before managing abilities');
        cy.get('.slot-2').should('not.exist');
    });

    it('It can manage abilities at higher levels', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('2{enter}');
        utilities.openAbilities('Cragheart', false);

        cy.get('#open-manage-abilities').click();

        cy.get('h2').contains('Manage abilities for each level');
        cy.get('p').contains('Select an ability card for each level, after choosing cards the available cards will be filtered accordingly');
        cy.get('.slot-2 .border-dashed').should('exist');
    });

    it('It filters available abilities', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('2{enter}');
        utilities.openAbilities('Cragheart', false);

        cy.get('#open-manage-abilities').click();

        cy.get('#manage-available-explosive-punch').click();
        cy.get('.slot-2 .border-dashed').should('not.exist');
        cy.get('.slot-2 #selected-available-explosive-punch').should('exist');

        utilities.closeModel();

        cy.get('#available-explosive-punch').should('exist');
        cy.get('#available-sentient-growth').should('not.exist');
    });

    it('It shows the Bear reference card in the stacked deck', () => {
        // Given a Beast Tyrant
        cy.visit('/tracker/#/characters');
        cy.window().then((win) => {
            const campaignData = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            campaignData.sheet = {...campaignData.sheet, characterUnlocks: {...campaignData.sheet?.characterUnlocks, BT: true}};
            win.localStorage.setItem(win.app.campaignId, JSON.stringify(campaignData));
        });
        cy.reload();
        utilities.openAbilities('Beast Tyrant');
        cy.window().then((win) => cy.spy(win.console, 'error').as('consoleError'));

        // When the Bear reference card, which has no initiative, is added to the deck
        cy.get('#available-bear-reference').click();

        // Then the stacked deck shows it
        cy.get('#deck-bear-reference').should('exist');
        cy.get('[id^="deck-"]').should('have.length', 1);
        cy.get('@consoleError').should('not.have.been.called');
    });
});
