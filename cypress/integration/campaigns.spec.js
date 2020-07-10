describe('Scenario list', () => {

    it('It loads campaigns', () => {
        cy.visit('/#/campaigns');

        cy.contains('Campaigns');
    });

    it('It can apply a campaign code', () => {
        cy.visit('/#/campaigns');

        cy.get('#add-shared-campaign').within(() => {
            cy.get('input[name=code]').type('123456');
            cy.get('form').submit();
            cy.contains('Connection refused');
        });
    });

    it('It can restore a purchase', () => {
        cy.visit('/#/campaigns');

        cy.get('#request-login-link').within(() => {
            cy.get('input[name=email]').type('test@test.com');
            cy.get('form').submit();
            cy.contains('Connection refused');
        });
    });

});
