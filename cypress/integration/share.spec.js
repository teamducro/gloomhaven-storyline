import utilities from "../utilities";

describe('Share', () => {

    it('It can share with new link format', () => {
        cy.visit('#/shared/1/local/N4RozgjARAXKYBcQGMC+AaEBDA5gYQCVZQswBtKAcUIFkoBdDbaguubAdxAk2QHseIADYgADEywAFAGIBlYp268BmEeMxgATAsQomYAMw6kAS30AWYyDOogA');

        utilities.isNodeVisible(1);
        utilities.isNodeVisible(2);
        utilities.isNodeIncomplete(3);
        utilities.isNodeIncomplete(4);
    });

});
