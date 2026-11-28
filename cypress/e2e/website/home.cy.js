import utilities from "../utilities";

// The Frosthaven site is the same build with MIX_MAIN_GAME=fh; its smoke run passes `mainGame=fh`.
const site = {
    gh: {name: 'Gloomhaven', firstScenario: 'Black Barrow', achievements: ['Global Achievements', 'Party Achievements'], partySheet: 'Party sheet'},
    fh: {name: 'Frosthaven', firstScenario: 'A Town in Flames', achievements: ['Campaign Stickers'], partySheet: 'Campaign sheet'},
}[Cypress.env('mainGame') || 'gh'];

describe('Home', () => {

    it('It loads the home page', () => {
        cy.visit('/');

        cy.get('#app').within(() => {
            cy.contains(`${site.name} Storyline Tracker`);
            cy.contains('The all in one campaign tracker');
            cy.contains('Contribute');
        });
    });

    it('It opens the storyline app', () => {
        cy.visit('/');

        cy.get('a').contains('Open storyline').click({ scrollBehavior: 'center' });
        cy.url().should('include', '/tracker')
    });

    it('It redirects to story', () => {
        cy.visit('/#/story');
        utilities.isTracker();
        cy.get('#chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It redirects to scenarios', () => {
        cy.visit('/#/scenarios');
        utilities.isTracker();
        cy.contains(site.firstScenario);
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
        site.achievements.forEach(heading => cy.contains(heading));
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
        cy.contains(site.partySheet);
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
