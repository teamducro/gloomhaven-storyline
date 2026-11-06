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

    it('It renders the 2x Frosthaven sticker at the same layout size', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/map');

        cy.get('#map #s1').should('have.attr', 'src').and('match', /\/img\/scenarios\/fh\/1\.webp$/);
        // The 1x sticker was 258px wide
        cy.get('#map #s1').should('have.prop', 'naturalWidth', 516).and('have.attr', 'width', '258');
    });

});
