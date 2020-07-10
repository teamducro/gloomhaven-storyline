describe('Scenario list', () => {

    it('It loads campaigns', () => {
        cy.visit('/#/campaigns');

        cy.contains('Campaigns');
    });

});
