import utilities from "../utilities";

describe('Storyline', () => {

    it('It loads the storyline', () => {
        cy.visit('/');

        cy.get('#chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It switches between landscape and portrait', () => {
        cy.visit('/');

        cy.get('.landscape').should(($node) => {
            expect($node.length).to.be.greaterThan(4);
        });

        cy.get('.portrait').should(($node) => {
            expect($node).to.have.length(0);
        });

        cy.viewport(500, 800);

        cy.get('.landscape').should(($node) => {
            expect($node).to.have.length(0);
        });

        cy.get('.portrait').should(($node) => {
            expect($node.length).to.be.greaterThan(4);
        });
    });

    it('It can complete a scenario', () => {
        cy.visit('/');
        utilities.isNodeVisible(1);
        utilities.isNodeHidden(2);

        utilities.completeScenario(1);
        utilities.isNodeVisible(2);
    });

    it('It can incomplete a scenario', () => {
        cy.visit('/');
        utilities.completeScenario(1);

        utilities.isNodeVisible(2);

        utilities.incompleteScenario(1);

        utilities.isNodeHidden(2);
    });

    it('It reveals chapters', () => {

        let alerted = false;
        cy.on('window:alert', message => alerted = message);

        cy.visit('/?states=1_c-2_c');

        cy.window().then((window) => {
            expect(alerted.includes('deprecated')).to.be.true;
        });

        cy.get('#chapter2').should(($chapter) => {
            expect($chapter).css('display', 'none');
        });

        utilities.completeScenario(3);

        cy.get('#chapter2').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It blocks blocked scenarios', () => {
        cy.visit('/?states=1_c-2_c-3_c-8_c');

        utilities.isNodeBlocked(9);
        utilities.openScenario(9);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It blocks required scenarios', () => {
        cy.visit('/?states=1_c-2_c-3_c-8_c');

        utilities.isNodeRequired(7);
        utilities.openScenario(7);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It unlocks required scenarios', () => {
        cy.visit('/?states=1_c-2_c-3_c-8_c');

        utilities.isNodeRequired(7);

        utilities.completeScenario(14);

        utilities.isNodeVisible(7);
        cy.get('#node7 .required').should(($radio) => {
            expect($radio).css('display', 'none');
        });

        utilities.openScenario(7);
        cy.get('#complete')
            .should('not.have.attr', 'disabled');
        utilities.closeModel();
    });

    it('It can share side scenarios', () => {
        cy.visit('/');

        cy.get('#node52.opacity-50').should(($node) => {
            expect($node).to.have.length(1);
        });

        cy.visit('/?states=52_i');

        utilities.isNodeVisible(52);
        cy.get('#node52.opacity-50').should(($node) => {
            expect($node).to.have.length(0);
        });
    });

});
