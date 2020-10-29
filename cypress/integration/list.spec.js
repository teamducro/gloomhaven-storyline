describe('Scenario list', () => {

    it('It loads the scenario list', () => {
        cy.visit('/tracker/#/scenarios');

        cy.get('#scenarios').should(($list) => {
            expect($list).to.have.length(1);
        });
    });

});
