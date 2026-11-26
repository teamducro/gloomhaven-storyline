import utilities from "../utilities";

describe('Map', () => {

    it('It loads the map', () => {
        cy.visit('/tracker/#/map');

        cy.get('#map #s1').should(($sticker) => {
            expect($sticker).to.have.length(1);
        });
    });

    it('It can open a scenario from the map', () => {
        cy.visit('/tracker/#/map');

        cy.get('#s1').click();

        cy.get('#scenario-title').should(($el) => {
            expect($el).to.have.length(1);
        });
    });

    it('It renders the 2x Gloomhaven sticker at the same layout size', () => {
        cy.visit('/tracker/#/map');

        cy.get('#map #s1').should('have.attr', 'src').and('match', /\/img\/scenarios\/gh\/1@2x\.webp$/);
        // The 1x sticker was 133px wide
        cy.get('#map #s1').should('have.prop', 'naturalWidth', 266).and('have.attr', 'width', '133');
    });

    it('It renders the 2x Frosthaven sticker at the same layout size', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/map');

        cy.get('#map #s1').should('have.attr', 'src').and('match', /\/img\/scenarios\/fh\/1@2x\.webp$/);
        // The 1x sticker was 258px wide
        cy.get('#map #s1').should('have.prop', 'naturalWidth', 516).and('have.attr', 'width', '258');
    });

    it('It switches from Gloomhaven to Jaws of the Lion with a blocked coupled scenario', () => {
        // Given scenario 35 is complete, so its coupled scenario 36 is blocked and shares its sticker
        utilities.enableGame('jotl');
        cy.visit('/tracker?states=1_c-2_c-4_c-5_c-10_c-22_c-35_c');
        cy.visit('/tracker/#/map');
        cy.window().its('app.scenarios').invoke('firstWhere', 'id', 36).its('state').should('eq', 'blocked');
        cy.window().then((win) => cy.spy(win.console, 'error').as('consoleError'));

        // When switching to Jaws of the Lion, whose scenarios have no 36 (without the reload of utilities.switchGame)
        cy.get('button').contains('menu').click();
        cy.get('.game-switch .mdc-select__anchor').click();
        cy.get('.jotl').click();

        // Then the Jaws of the Lion map shows without errors
        cy.window().its('app.game').should('eq', 'jotl');
        cy.get('#map #s1').should('have.length', 1);
        cy.get('@consoleError').should('not.have.been.called');
    });
});
