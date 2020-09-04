import utilities from "../utilities";

describe('Share', () => {

    it('It can share with new link format', () => {
        cy.visit('#/shared/1/local/N4RozgjARAXKYBcQGMC+AaEBDA5gYQCVZQswBtKAcUIFkoBdDbaguubAdxAk2QHseIADYgADEywAFAGIBlYp268BmEeMxgATAsQomYAMw6kAS30AWYyDOogA');

        utilities.isNodeVisible(1);
        utilities.isNodeVisible(2);
        utilities.isNodeIncomplete(3);
        utilities.isNodeIncomplete(4);
    });

    it('It shares the party sheet', () => {
        cy.visit('#/shared/1/local/N4RozgjARAXKDGALAdgVwDboDQmVKOADvGpjmAC4gCWOFA2gLoC+OAhgOYDCASrKGzD0oAcV4BZKC3ZiekuCDYB3EBBzwA9mpDoQABlbhECRG3qqc2q5Zv6ce+47vOHLp672McAEwh7-ONTewFAA7NAwdmEATLBRoQDMcQ5hACzJWGEArBlhAGy5oaGFAByFAJy5JXpVEVElsZEpJUlNmSXpbVAlOV0lBX3FfWV9lV3lNeN1KeWNUeWt853zvfqGeABiGhoABABCbABOBCCE1HlZOIfRrqjmHu6PLizMQA');
        cy.visit('/#/party');

        cy.get('input[aria-labelledby="reputation"]').should('have.value', '20');
        cy.get('input[aria-labelledby="donations"]').should('have.value', '1000');
        cy.get('input#p-35').should('be.checked');
        cy.get('input#p-65').should('be.checked');
        cy.get('span').contains('064–070').prev().find('input').should('be.checked');
        cy.get('#notes').should('have.value', 'Foo Bar');
    });

});
