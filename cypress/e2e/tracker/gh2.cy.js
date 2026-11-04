import utilities from "../utilities";

describe('Gloomhaven 2nd Edition', () => {

    it('It loads gh2 once enabled', () => {
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');

        utilities.scenarios().then((scenarios) => {
            expect(scenarios.firstWhere('id', 1).game).eq('gh2');
            expect(scenarios.firstWhere('id', 1).state).eq('incomplete');
        });

        cy.visit('/tracker/#/scenarios');
        cy.get('#scenarios').contains('Bandit Camp');

        cy.visit('/tracker/#/party');
        cy.contains('Prosperity');
    });

    it('It is unlocked by a Gloomhaven purchase and synced as gh', () => {
        cy.intercept('PUT', '**/stories/1', {statusCode: 500});
        cy.visit('/tracker');
        cy.window().then((win) => {
            win.localStorage.setItem('stories', JSON.stringify([
                {id: 1, name: 'Owned', data: {}, games: ['gh'], expires_at: '2099-01-01'}
            ]));
            win.localStorage.setItem('campaignId', JSON.stringify('_1'));
        });
        cy.reload();
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');

        cy.window().then((win) => {
            expect(win.app.game).eq('gh2');
            expect(win.app.story.postData().game).eq('gh');
        });
    });

    it('It asks to purchase Gloomhaven when the campaign only has Frosthaven', () => {
        cy.intercept('PUT', '**/stories/1', {statusCode: 500});
        cy.visit('/tracker');
        cy.window().then((win) => {
            win.localStorage.setItem('stories', JSON.stringify([
                {id: 1, name: 'Owned', data: {sheet: {edition: 2}}, games: ['fh'], expires_at: '2099-01-01'}
            ]));
            win.localStorage.setItem('_1', JSON.stringify({sheet: {edition: 2}}));
            win.localStorage.setItem('game', JSON.stringify('fh'));
            win.localStorage.setItem('campaignId', JSON.stringify('_1'));
        });
        cy.visit('/tracker');

        cy.get('button').contains('menu').click();
        cy.get('.game-switch .mdc-select__selected-text').click();
        cy.get('.gh2').click();
        cy.get('.mdc-dialog--open').contains('Gloomhaven 2nd Edition');
        cy.get('.mdc-dialog--open button').contains('Purchase Gloomhaven');
        cy.window().its('app.game').should('not.eq', 'gh2');
    });
});
