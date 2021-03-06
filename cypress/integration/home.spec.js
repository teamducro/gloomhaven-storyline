import utilities from "../utilities";

describe('Home', () => {

    it('It loads the home page', () => {
        cy.visit('/');

        cy.get('#app').within(() => {
            cy.contains('Gloomhaven Storyline Tracker!');
            cy.contains('Contribute');
        });
    });

    it('It opens the storyline app', () => {
        cy.visit('/');

        cy.get('a').contains('Open storyline').click();
        cy.url().should('include', '/tracker')
    });

    it('It redirects to story', () => {
        cy.visit('/#/story');
        utilities.isTracker();
        cy.get('.chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It redirects to scenarios', () => {
        cy.visit('/#/scenarios');
        utilities.isTracker();
        cy.contains('Black Barrow');
    });

    it('It redirects to map', () => {
        cy.visit('/#/map');
        utilities.isTracker();
        cy.get('#map #s1').should(($sticker) => {
            expect($sticker).to.have.length(1);
        });
    });

    it('It redirects to achievements', () => {
        cy.visit('/#/achievements');
        utilities.isTracker();
        cy.contains('Global Achievements');
        cy.contains('Party Achievements');
    });

    it('It redirects to info', () => {
        cy.visit('/#/info');
        utilities.isTracker();
        cy.get('#info').within(() => {
            cy.contains('Play Gloomhaven with a storyline tracker');
        });
    });

    it('It redirects to campaigns', () => {
        cy.visit('/#/campaigns');
        utilities.isTracker();
        cy.contains('Campaigns');
    });

    it('It redirects to party', () => {
        cy.visit('/#/party');
        utilities.isTracker();
        cy.contains('Party sheet');
    });

    it('It redirects to login', () => {
        cy.visit('/#/login/1/token');
        utilities.isTracker();
    });

    it('It redirects to shared', () => {
        cy.visit('/#/shared');
        utilities.isTracker();
    });
});
