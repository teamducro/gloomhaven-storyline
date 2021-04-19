import utilities from "../utilities";

describe('Storyline', () => {

    it('It loads the storyline', () => {
        cy.visit('/tracker');

        cy.get('#chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It switches between landscape and portrait', () => {
        cy.visit('/tracker');

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
        cy.visit('/tracker');
        utilities.isNodeVisible(1);
        utilities.isNodeHidden(2);

        utilities.completeScenario(1);
        utilities.isNodeVisible(2);
    });

    it('It can incomplete a scenario', () => {
        cy.visit('/tracker');
        utilities.completeScenario(1);

        utilities.isNodeVisible(2);

        utilities.incompleteScenario(1);

        utilities.isNodeHidden(2);
    });

    it('It reveals chapters', () => {
        let alerted = false;
        cy.on('window:alert', message => alerted = message);

        cy.visit('/tracker?states=1_c-2_c');

        cy.window().then((window) => {
            expect(alerted.includes('deprecated')).to.be.true;
        });

        cy.get('#chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });

        cy.get('#chapter2').should(($chapter) => {
            expect($chapter).css('display', 'none');
        });

        utilities.completeScenario(3);

        cy.get('#chapter1, #chapter2').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It blocks blocked scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

        utilities.isNodeBlocked(9);
        utilities.openScenario(9);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It blocks required scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

        utilities.isNodeRequired(7);
        utilities.openScenario(7);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It unlocks required scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

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
        cy.visit('/tracker');

        cy.get('#node52.opacity-50').should(($node) => {
            expect($node).to.have.length(1);
        });

        cy.visit('/tracker?states=52_i');

        utilities.isNodeVisible(52);
        cy.get('#node52.opacity-50').should(($node) => {
            expect($node).to.have.length(0);
        });
    });

    it('It can open a scenario via url', () => {
        cy.visit('/tracker/#/story/1');

        cy.get('#scenario-title').contains('#1 Black Barrow');
    });

    it('It shows summaries', () => {
        cy.visit('/tracker');

        utilities.openScenario(1);

        cy.get('#scenario-content').contains('Preceding events');
        cy.get('#scenario-content label').contains('Complete').click();
        cy.get('#scenario-content').contains('Summary').click();
        cy.get('#scenario-content').contains('Jekserah');

        utilities.closeModel();
    });

    it('It opens FC', () => {
        cy.visit('/tracker');

        cy.get('button').contains('menu').click();
        cy.get('.mdc-list-item__text').contains('Storyline').next().click();
        cy.get('.fc').click();

        utilities.isNodeIncomplete(96);
        utilities.completeScenario(96);
        utilities.isNodeComplete(96);
        utilities.isNodeIncomplete(97);
    });

});
