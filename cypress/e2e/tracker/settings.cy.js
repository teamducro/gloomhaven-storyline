import utilities from "../utilities";

describe('Settings', () => {

    it('It loads the settings page', () => {
        cy.visit('/tracker/#/settings');

        cy.contains('Transfer campaign data');
        cy.contains('Snapshots');
        cy.contains('Translations');
        cy.contains('Font');
        cy.contains('Danger zone!');
    });

    it('It enables ConQuests for the campaign and syncs it with the sheet', () => {
        cy.visit('/tracker/#/settings');

        cy.contains('h1', 'Promo Pack');
        cy.get('#conquests-enabled').check();
        cy.window().then((win) => {
            const data = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            expect(data['sheet'].conquestsEnabled).to.eq(true);
        });

        cy.reload();
        cy.get('#conquests-enabled').should('be.checked');
    });

    it('It leaves no trace in stored data when ConQuests is turned off again', () => {
        cy.visit('/tracker/#/settings');

        cy.get('#conquests-enabled').check();
        cy.get('#conquests-enabled').uncheck();
        cy.window().then((win) => {
            const data = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            expect(data['sheet']).to.not.have.property('conquestsEnabled');
        });
    });

    it('It hides the Promo Pack section for games without ConQuests', () => {
        utilities.enableGame('jotl');
        utilities.switchGame('jotl');
        cy.visit('/tracker/#/settings');

        cy.contains('Enabled Games');
        cy.contains('h1', 'Promo Pack').should('not.exist');
    });

    it('It stores ConQuests on the Frosthaven campaign sheet', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/settings');

        cy.get('#conquests-enabled').check();
        cy.window().then((win) => {
            const data = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            expect(data['campaign-fh'].conquestsEnabled).to.eq(true);
        });
    });

    it('It does not overwrite reloaded campaign data when toggling ConQuests', () => {
        cy.visit('/tracker/#/settings');
        cy.get('#conquests-enabled');

        // A teammate's sync lands while Settings is open: same path as the live-sync listener in app.js.
        cy.window().then(async (win) => {
            const data = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            data['sheet'] = {...(data['sheet'] || {}), prosperityIndex: 10};
            win.localStorage.setItem(win.app.campaignId, JSON.stringify(data));
            await win.app.loadCampaignData();
            await win.app.campaignsChanged(false);
        });

        cy.get('#conquests-enabled').check();
        cy.window().then((win) => {
            const data = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            expect(data['sheet'].prosperityIndex).to.eq(10);
            expect(data['sheet'].conquestsEnabled).to.eq(true);
        });
    });

    it('It disables the ConQuests checkbox when read only', () => {
        cy.visit('/tracker/#/settings');

        utilities.setReadOnly().then(() => {
            cy.get('#conquests-enabled').should('be.disabled');
        });
    });

});
