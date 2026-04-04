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

});
