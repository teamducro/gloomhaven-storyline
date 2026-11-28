import utilities from "../utilities";

describe('Party FH', () => {

    // Enable Frosthaven and switch to it
    before(() => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
    })

    it('It loads the campaign sheet', () => {
        cy.visit('/tracker/#/party');

        cy.contains('Campaign sheet');
        cy.contains('Morale');
        cy.contains('Defense');
        cy.contains('Town Guard Perks');
        cy.contains('Prosperity');
        cy.contains('Scenario level');
        cy.contains('Summer Outpost Event Decks');
        cy.contains('Summer Road Event Decks');
        cy.contains('notes');
    });

    describe('in read only mode', () => {
        beforeEach(() => {
            utilities.enableGame('fh');
            utilities.switchGame('fh');
        });

        it('It cant change buildings', () => {
            cy.visit('/tracker/#/buildings');
            // Wreck one building first so its (icon-only) Repair button is checked as well.
            cy.contains('button', 'Wreck').click();

            utilities.setReadOnly().then(() => {
                cy.contains('h2', 'Buildings').parent()
                    .find('.mdc-button')
                    .filter((index, button) => !button.closest('.mdc-dialog'))
                    .should('have.length.greaterThan', 0)
                    .each(($button) => expect($button).to.be.disabled);
            });
        });

        it('It cant remove a wall by clicking its badge', () => {
            cy.visit('/tracker/#/buildings');
            cy.window().then((win) => {
                win.app.overlays.firstWhere('_name', 'Wall').present = true;
            });
            cy.get('#overlay-badges .bedge').should('have.length', 1);

            utilities.setReadOnly().then(() => {
                cy.get('#overlay-badges .bedge').click();
                cy.get('#overlay-badges .bedge').should('have.length', 1);
            });
        });

        it('It cant unlock alchemy potions', () => {
            cy.visit('/tracker/#/party');

            utilities.setReadOnly().then(() => {
                cy.get('a.cursor-pointer.outline-gray').first().click();
                cy.get('.mdc-dialog--open').contains('button', 'Confirm').should('be.disabled');
            });
        });

        it('It cant remove calendar sections', () => {
            cy.visit('/tracker/#/party');
            cy.get('.md\\:grid-cols-20 > div').first().click();
            cy.get('.mdc-dialog--open').contains('button', 'Add').click();

            // The week can't be opened in read only mode, so switch while it's open.
            utilities.setReadOnly().then(() => {
                cy.get('.mdc-dialog--open ul button').first().should('be.disabled');
            });
        });
    });

    it('It syncs once per class unlock', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/party');
        cy.window().then((win) => cy.spy(win.app.storySyncer.constructor.prototype, 'store').as('sync'));

        cy.get('#character-IF').check({force: true});

        cy.get('@sync').should('have.been.calledOnce');
        cy.window().its('app.campaignData.campaign-fh.characterUnlocks.IF').should('eq', true);
    });

    it('It starts new campaigns with four soldiers', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/party');

        cy.get('#s-4').should('be.checked');
        cy.get('#s-5').should('not.be.checked');
    });

    it('It shows the Ancient Coins requirement for upgrading the Tavern to level 3', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/party');
        cy.window().then((win) => {
            const tavern = win.app.buildings.firstWhere('id', 74);
            tavern.state = 'built';
            tavern.level = 1;
        });
        cy.visit('/tracker/#/buildings');
        cy.contains('Requires 3 Ancient Coins (Item 245)').should('not.exist');

        cy.window().then((win) => {
            win.app.buildings.firstWhere('id', 74).level = 2;
        });
        cy.visit('/tracker/#/buildings');
        cy.contains('Requires 3 Ancient Coins (Item 245)');
    });

    describe('Temple of the Great Oak', () => {
        const temple = () => cy.get('img[src^="/img/buildings/fh/42-level-"]');
        const storeCampaign = (changes) => {
            cy.visit('/tracker/#/party');
            cy.window().then((win) => {
                const campaignData = JSON.parse(win.localStorage.getItem('local'));
                win.localStorage.setItem('local', JSON.stringify({...campaignData, ...changes}));
            });
            cy.reload();
        };

        beforeEach(() => {
            utilities.enableGame('fh');
            utilities.switchGame('fh');
        });

        it('It switches to its alternate level 3 sticker while The Frosthaven Seal is completed', () => {
            const markFrosthavenSeal = (label) => {
                cy.visit('/tracker/#/scenarios');
                cy.get('td').contains('#64 The Frosthaven Seal').click({scrollBehavior: 'center'});
                cy.get('#scenario-content label').contains(label).click();
                utilities.closeModel();
                cy.visit('/tracker/#/buildings');
            };

            // Given
            cy.visit('/tracker?states=61_c-62_c-63_c');
            storeCampaign({'building-fh-42': {state: 'built', level: 3}});

            // When
            markFrosthavenSeal('Complete');

            // Then
            temple().should('have.attr', 'src', '/img/buildings/fh/42-level-3-alternate.png');
            temple().parents('.grid').first().contains('Upgrade').should('not.exist');

            // When
            markFrosthavenSeal('Incomplete');

            // Then
            temple().should('have.attr', 'src', '/img/buildings/fh/42-level-3.png');
        });

        it('It shows the level 3 card for a Temple stored at the former level 4', () => {
            // Given
            storeCampaign({
                ...Object.fromEntries([61, 62, 63, 64].map(id => [`scenario-fh-${id}`, {state: 'complete'}])),
                'building-fh-42': {state: 'built', level: 4},
            });

            // When
            cy.visit('/tracker/#/buildings');

            // Then
            temple().should('have.attr', 'src', '/img/buildings/fh/42-level-3-alternate.png');
            temple().click();
            cy.get('.mdc-dialog--open img[src*="/img/buildings/fh/42-level-3-front."]');
        });
    });

    it('It uses the same season for a calendar week in the grid and in the week modal', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/party');

        cy.get('.md\\:grid-cols-20 > div').eq(9).should('have.class', 'bg-orange-1000').click();
        cy.get('.mdc-dialog--open').contains('Week 10 Summer');
        utilities.closeModel();

        cy.get('.md\\:grid-cols-20 > div').eq(10).should('have.class', 'bg-blue-1000').click();
        cy.get('.mdc-dialog--open').contains('Week 11 Winter');
    });
});
