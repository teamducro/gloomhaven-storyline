describe('Scenario list', () => {

    it('It loads the scenario list', () => {
        cy.visit('/#/scenarios');

        cy.get('#scenarios').should(($list) => {
            expect($list).to.have.length(1);
        });
    });

});
