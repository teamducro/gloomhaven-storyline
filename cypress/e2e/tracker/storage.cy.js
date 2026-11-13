import utilities from "../utilities";
import migrateVersion2Progress from "../../../resources/js/services/app/migrateVersion2Progress";

describe('Storage', () => {
    it('It stores data correctly in local storage', () => {
        let collect = require('collect.js');

        cy.visit('/tracker');
        utilities.completeScenario(1);

        utilities.store().then((store) => {
            let campaignData = JSON.parse(store.getItem('local'));
            campaignData = collect(campaignData).map(x => JSON.stringify(x));

            expect(campaignData.get('scenario-gh-1')).eq('{"random_item_treasure":false,"state":"complete"}');
            expect(campaignData.get('achievementgroup-CR')).eq('{"achievements":["GCRM"]}');
            expect(campaignData.get('achievement-GCRM')).eq('{"awarded":true,"count":1,"lost":false}');
            expect(campaignData.get('achievement-PFS')).eq('{"awarded":true,"count":1,"lost":false}');
            expect(campaignData.get('scenario-gh-2')).eq('{"random_item_treasure":false,"state":"incomplete"}');
        });
    });

    it('It persists the hidePersonalQuests and crossGameItemsEnabled toggles across reloads', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();

        // hidePersonalQuests is left out while unset (so existing campaigns keep their sync hash);
        // crossGameItemsEnabled has always been stored.
        utilities.store().then((store) => {
            const sheet = JSON.parse(store.getItem('local')).sheet;
            expect(sheet).not.to.have.property('hidePersonalQuests');
            expect(sheet.crossGameItemsEnabled).eq(false);
        });

        utilities.scrollTo('100%', true);
        cy.get('#hide-personal-quests').check();

        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Boots of Striding');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#cross-game-items-enabled-checkbox').check();

        cy.reload();

        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Boots of Striding');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#cross-game-items-enabled-checkbox').should('be.checked');

        cy.visit('/tracker/#/characters');
        utilities.scrollTo('100%', true);
        cy.get('#hide-personal-quests').should('be.checked');
    });

    // Storable.read() must keep a stored false/0: reading it back as undefined drops the key on
    // the next save, which changes the sheet's sync hash (Versionable.makeHash) and bumps its version.
    it('It keeps stored false and 0 values after a reload and another save', () => {
        cy.visit('/tracker/#/party');
        cy.get('input[aria-labelledby="donations"]').clear().type('10{enter}');
        cy.reload();
        cy.get('input[aria-labelledby="donations"]').clear().type('20{enter}');

        utilities.store().then((store) => {
            const sheet = JSON.parse(store.getItem('local')).sheet;
            expect(sheet.donations).eq(20);
            expect(sheet.reputation).eq(0);
            expect(sheet.crossGameItemsEnabled).eq(false);
            // Left out while unset, so adding them doesn't change existing campaigns' sync hash.
            expect(sheet).not.to.have.property('enhancementsEnabled');
            expect(sheet).not.to.have.property('enhancements');
            expect(sheet).not.to.have.property('hidePersonalQuests');
            expect(sheet).not.to.have.property('removedItems');
            expect(sheet).not.to.have.property('eventHistory');
        });
    });

    describe('Donation prosperity migration', () => {
        const visitWith = (campaignData) => {
            // Seed from the website page, a still running tracker would overwrite the data
            cy.visit('/');
            cy.window().then((win) => win.localStorage.setItem('local', JSON.stringify(campaignData)));
            cy.visit('/tracker');
        };
        const sheet = () => cy.window().its('localStorage').then((storage) => JSON.parse(storage.getItem('local')));

        it('It moves hand-ticked donation checks out of prosperity once', () => {
            // 150 gold donated = 2 donation checks, ticked by hand before they were automatic.
            visitWith({sheet: {donations: 150, prosperityIndex: 6}});
            sheet().should((data) => {
                expect(data.sheet.prosperityIndex).eq(4);
                expect(data['migrated-donations-sheet']).eq(true);
            });

            // An older client rewrites the sheet with only the fields it knows, but keeps the marker key.
            sheet().then((data) => visitWith({...data, sheet: {donations: 150, prosperityIndex: 4}}));
            sheet().its('sheet.prosperityIndex').should('eq', 4);
        });

        it('It migrates and marks the sheets of games that are not opened on load', () => {
            // Migrated on load, so a sync never sends a migrated sheet without its marker.
            visitWith({'sheet-cs': {donations: 150, prosperityIndex: 6}});
            sheet().should((data) => {
                expect(data['sheet-cs'].prosperityIndex).eq(4);
                expect(data['migrated-donations-sheet-cs']).eq(true);
            });
        });

        it('It does not migrate a sheet marked by the previous in-sheet flag', () => {
            visitWith({sheet: {donations: 150, prosperityIndex: 4, autoDonationProsperity: true}});
            sheet().should((data) => {
                expect(data['migrated-donations-sheet']).eq(true);
                expect(data.sheet.prosperityIndex).eq(4);
            });
        });
    });

    describe('Sheet migrations', () => {
        const story = {id: 9, name: 'Synced', data: {}, games: ['gh'], expires_at: '2099-01-01', hash: 'x', updated_at: '2020-01-01T00:00:00Z'};
        const storage = (key) => cy.window().its('localStorage').then((localStorage) => JSON.parse(localStorage.getItem(key)));

        // Logged in, with the sync requests failing like when offline
        function visitWith({campaignId = 'local', campaignData, page = 'story', stories = [], delay = 1500}) {
            utilities.startServer();
            cy.intercept('GET', '**/user', {statusCode: 500});
            cy.intercept('GET', '**/stories', {statusCode: 500, delay}).as('stories');
            cy.intercept('PUT', '**/stories/9', {statusCode: 500}).as('put');
            // Seed from the website page, a still running tracker would overwrite the data
            cy.visit('/');
            cy.window().then((win) => {
                win.localStorage.setItem('token', JSON.stringify('secret'));
                win.localStorage.setItem('user', JSON.stringify({id: 1, name: 'Test', email: 'a@b.c'}));
                win.localStorage.setItem('stories', JSON.stringify(stories));
                win.localStorage.setItem('campaignId', JSON.stringify(campaignId));
                win.localStorage.setItem(campaignId, JSON.stringify(campaignData));
            });
            cy.visit('/tracker/#/' + page);
            cy.wait('@stories');
            cy.get('#app').should('exist');
            cy.window().its('app.scenarios').should('exist');
        }

        it('It keeps the campaign when a page builds a sheet while the campaign is still loading', () => {
            // Given a campaign with progress, opened on the party page while the stories are fetched
            visitWith({
                campaignData: {sheet: {reputation: 5}, 'scenario-gh-1': {state: 'complete'}},
                page: 'party',
            });

            // Then the stored campaign still holds its progress
            storage('local').should((data) => {
                expect(data.sheet.reputation).eq(5);
                expect(data['scenario-gh-1'].state).eq('complete');
            });
        });

        it('It sends the migration markers with the first sync', () => {
            // Given a synced campaign from before the class events migration
            visitWith({
                campaignId: '_9',
                campaignData: {sheet: {reputation: 5, characterUnlocks: {DS: true}}},
                stories: [story],
                delay: 0,
            });

            // When it syncs
            cy.document().then((doc) => doc.dispatchEvent(new KeyboardEvent('keydown', {code: 'KeyS', ctrlKey: true, metaKey: true})));

            // Then the first sync holds the migrated sheet and its marker
            cy.wait('@put').then((interception) => {
                const data = JSON.parse(interception.request.body.data);
                expect(data['migrated-class-events-sheet']).eq(true);
                expect(data.sheet.reputation).eq(5);
                expect(data.sheet.classEventsAdded).to.deep.equal({DS: ['unlock']});
            });
        });

        it('It does not count a migration as a newer local campaign', () => {
            // Given a synced campaign that was loaded before
            visitWith({campaignId: '_9', campaignData: {sheet: {reputation: 5, characterUnlocks: {DS: true}}}, stories: [story]});

            // And that still needs the class events migration, synced long ago
            storage('_9').then((data) => {
                delete data.sheet.classEventsAdded;
                delete data['migrated-class-events-sheet'];
                storage('stories').then((stories) => visitWith({
                    campaignId: '_9',
                    campaignData: data,
                    stories: [{...stories[0], updated_at: story.updated_at}],
                }));
            });

            // Then the migration doesn't make the local campaign newer than the server's
            storage('_9').its('sheet.classEventsAdded').should('deep.equal', {DS: ['unlock']});
            storage('stories').should((stories) => {
                expect(new Date(stories[0].updated_at).getTime()).eq(new Date(story.updated_at).getTime());
            });
        });

        it('It restores the GH2e edition when an older client dropped it', () => {
            // Given a GH2e campaign whose Gloomhaven sheet an older client rewrote without the edition
            visitWith({
                campaignData: {sheet: {reputation: 1}, 'sheet-gh2': {reputation: 2}},
            });

            // Then the campaign is played as GH2e again
            storage('local').its('sheet.edition').should('eq', 2);
            cy.window().its('app.game').should('eq', 'gh2');
        });
    });

    it('It keeps stored campaign sheet false values after a reload and another save', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/party');
        cy.get('input[aria-labelledby="morale"]').clear().type('3{enter}');
        cy.reload();
        cy.get('input[aria-labelledby="morale"]').clear().type('4{enter}');

        utilities.store().then((store) => {
            const campaign = JSON.parse(store.getItem('local'))['campaign-fh'];
            expect(campaign.morale).eq(4);
            expect(campaign.crossGameItemsEnabled).eq(false);
            expect(campaign).not.to.have.property('enhancementsEnabled');
            expect(campaign).not.to.have.property('enhancements');
            expect(campaign).not.to.have.property('hidePersonalQuests');
            expect(campaign).not.to.have.property('removedItems');
            expect(campaign).not.to.have.property('eventHistory');
        });
    });

    it('It migrates storage version 2 to 3 with game in scenario key', () => {
        const oldCampaignData = JSON.parse('{"achievementgroup-CR":{"achievements":["GCRM"]},"achievementgroup-ART":{"achievements":["GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC"]},"scenario-1":{"state":"complete","treasures":["7"]},"achievement-PFS":{"awarded":true,"count":1,"lost":false},"scenario-2":{"state":"complete"},"scenario-3":{"state":"complete","treasures":["65"]},"achievement-PJP":{"awarded":true,"count":1,"lost":false},"scenario-4":{"state":"complete","treasures":["38","46"]},"scenario-5":{"state":"complete","treasures":["4","28"]},"scenario-6":{"state":"complete","treasures":["50"]},"achievement-PDB":{"awarded":true,"count":1,"lost":false},"scenario-7":{"state":"complete"},"scenario-8":{"state":"complete","treasures":["51"]},"achievement-GTMF":{"awarded":true,"count":1,"lost":false},"scenario-9":{"state":"blocked"},"scenario-10":{"state":"complete","treasures":["11"]},"achievement-PADE":{"awarded":true,"count":1,"lost":false},"scenario-13":{"choice":15,"state":"complete","treasures":["10"]},"scenario-14":{"state":"complete","treasures":["26"]},"achievement-GTPE":{"awarded":true,"count":1,"lost":false},"scenario-15":{"state":"complete"},"scenario-16":{"state":"complete","treasures":["1"]},"scenario-17":{"state":"complete","treasures":["71"]},"scenario-18":{"state":"complete","treasures":["63"]},"scenario-19":{"state":"complete","treasures":["17"]},"achievement-PSC":{"awarded":true,"count":1,"lost":false},"scenario-20":{"state":"complete"},"scenario-21":{"state":"complete","treasures":["15"]},"achievement-GTRN":{"awarded":true,"count":1,"lost":false},"scenario-22":{"state":"complete","treasures":["21"]},"achievement-GAC":{"awarded":true,"count":1,"lost":false},"achievement-GAR":{"awarded":false,"count":0,"lost":true},"scenario-23":{"state":"complete","treasures":["39","72"]},"achievement-GAT":{"awarded":true,"count":5,"lost":false,"manual_awarded":false},"achievement-PTR":{"awarded":true,"count":1,"lost":false},"scenario-24":{"state":"complete","treasures":["70"]},"achievement-PTVC":{"awarded":true,"count":1,"lost":false},"scenario-25":{"promptChoice":"dragonChoice1","state":"complete","treasures":["58"]},"achievement-PTDC":{"awarded":true,"count":1,"lost":false},"scenario-26":{"state":"complete","treasures":["66"]},"achievement-PFC":{"awarded":true,"count":1,"lost":false},"scenario-27":{"state":"complete"},"scenario-28":{"state":"complete","treasures":["32"]},"achievement-PAI":{"awarded":true,"count":1,"lost":false},"scenario-29":{"state":"complete","treasures":["41"]},"achievement-GTED":{"awarded":true,"count":1,"lost":false},"scenario-30":{"state":"complete"},"achievement-PTSV":{"awarded":true,"count":1,"lost":false},"scenario-31":{"state":"complete","treasures":["69"]},"scenario-32":{"state":"complete"},"scenario-33":{"promptChoice":"dragonChoice1","state":"complete"},"achievement-PTVT":{"awarded":true,"count":1,"lost":false},"achievement-PTDT":{"awarded":true,"count":1,"lost":false},"scenario-34":{"state":"blocked","treasures":["23"]},"scenario-35":{"state":"blocked"},"scenario-36":{"state":"blocked"},"scenario-37":{"state":"complete","treasures":["49"]},"achievement-PTTT":{"awarded":true,"count":1,"lost":false},"scenario-38":{"state":"complete","treasures":["29"]},"achievement-PRA":{"awarded":true,"count":1,"lost":false},"scenario-39":{"state":"complete","treasures":["73"]},"achievement-PATD":{"awarded":true,"count":1,"lost":false},"scenario-40":{"state":"complete","treasures":["47"]},"achievement-GAT2":{"awarded":true,"count":1,"lost":false},"scenario-41":{"state":"complete","treasures":["24"]},"achievement-GTVF":{"awarded":true,"count":1,"lost":false},"scenario-42":{"state":"blocked"},"scenario-43":{"state":"complete","treasures":["35"]},"achievement-GWB":{"awarded":true,"count":1,"lost":false},"scenario-44":{"state":"complete"},"scenario-46":{"state":"complete","treasures":["48"]},"achievement-GEOC":{"awarded":true,"count":3,"lost":false},"scenario-47":{"state":"complete","treasures":["18","57"]},"achievement-GEOC2":{"awarded":true,"count":1,"lost":false},"scenario-48":{"state":"complete","treasures":["64"]},"achievement-GEOC3":{"awarded":true,"count":1,"lost":false},"scenario-51":{"state":"complete","treasures":["56"]},"achievement-GEOG":{"awarded":true,"count":1,"lost":false},"scenario-52":{"state":"complete"},"scenario-53":{"state":"complete"},"scenario-54":{"state":"complete"},"scenario-57":{"state":"complete","treasures":["3","22"]},"scenario-58":{"state":"complete"},"scenario-61":{"state":"complete"},"scenario-62":{"state":"complete","treasures":["59"]},"scenario-63":{"state":"complete","treasures":["12"]},"scenario-64":{"state":"complete","treasures":["9"]},"scenario-65":{"state":"complete"},"scenario-66":{"state":"complete","treasures":["16","36"]},"achievement-GAT3":{"awarded":true,"count":1,"lost":false},"scenario-67":{"state":"complete","treasures":["14"]},"scenario-68":{"state":"complete","treasures":["33"]},"scenario-69":{"state":"complete"},"scenario-70":{"state":"complete","treasures":["6"]},"scenario-71":{"state":"complete"},"scenario-72":{"state":"complete"},"scenario-73":{"state":"complete"},"scenario-74":{"state":"complete","treasures":["20"]},"scenario-76":{"state":"complete","treasures":["75"]},"scenario-77":{"state":"complete"},"scenario-78":{"state":"complete"},"scenario-81":{"state":"complete","treasures":["68"]},"scenario-82":{"promptChoice":2,"state":"complete","treasures":["62"]},"scenario-83":{"state":"complete"},"scenario-84":{"state":"complete","treasures":["42"]},"scenario-94":{"state":"complete"},"achievement-PTTN":{"awarded":true,"count":1,"lost":false},"scenario-95":{"state":"complete"},"achievement-GTDA":{"awarded":true,"count":1,"lost":false},"scenario-11":{"state":"hidden","treasures":["5"]},"sheet":{"characters":{"0":true,"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true,"11":true,"12":true,"13":true,"14":true,"15":true,"16":true,"17":true},"city":{},"donations":620,"itemDesigns":{"1":true,"5":true,"39":true,"41":true,"48":true,"52":true,"59":true,"66":true,"70":true,"90":true,"99":true,"110":true,"112":true,"122":true,"130":true,"132":true,"133":true,"153":true,"154":true,"155":true,"157":true,"158":true,"159":true,"161":true,"163":true,"NaN":true},"prosperityIndex":61,"reputation":15,"road":{},"unlocks":{"0":true,"1":true,"2":true,"3":true,"4":true,"7":true}},"achievement-PT":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-PHSE":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-PBB":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-GAT4":{"awarded":true,"count":1,"lost":false},"achievement-GAT5":{"awarded":true,"count":1,"lost":false},"scenario-96":{"state":"complete","treasures":["91"]},"scenario-89":{"state":"complete","treasures":["13","43","27"]},"achievement-PSR":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"scenario-88":{"state":"hidden"},"achievement-PWS":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"achievement-GCRM":{"awarded":true,"count":1,"lost":false},"scenario-87":{"state":"hidden"},"achievement-PTPS":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"scenario-86":{"state":"hidden"},"scenario-93":{"state":"hidden"},"achievement-PAMT":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"scenario-91":{"state":"complete"},"scenario-92":{"state":"incomplete"},"achievement-PDC":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-GTTP":{"awarded":true,"count":1,"lost":false},"scenario-97":{"state":"complete"},"scenario-98":{"choice":"102,103","promptChoice":1,"state":"complete","treasures":["79"]},"scenario-99":{"choice":"104,105","promptChoice":2,"state":"complete","treasures":["95"]},"scenario-100":{"promptChoice":1,"state":"complete","treasures":["76","85"]},"scenario-101":{"state":"complete","treasures":["93"]},"achievement-GKIP":{"awarded":true,"count":4,"lost":false},"achievement-PC":{"awarded":true,"count":1,"lost":false},"scenario-102":{"state":"complete","treasures":["77","86"]},"scenario-103":{"state":"complete","treasures":["81"]},"achievement-GKIP2":{"awarded":true,"count":1,"lost":false},"scenario-104":{"state":"complete","treasures":["87"]},"scenario-105":{"state":"complete","treasures":["83","88"]},"achievement-GKIP3":{"awarded":true,"count":1,"lost":false},"scenario-106":{"state":"hidden"},"scenario-107":{"state":"hidden"},"achievement-GKIP4":{"awarded":true,"count":1,"lost":false},"scenario-108":{"promptChoice":3,"state":"complete"},"scenario-109":{"state":"complete","treasures":["80","94"]},"scenario-110":{"choice":114,"state":"complete","treasures":["84"]},"achievement-PGD":{"awarded":true,"count":1,"lost":false},"achievement-PDE":{"awarded":true,"count":1,"lost":false},"scenario-111":{"promptChoice":1,"state":"complete","treasures":["82"]},"achievement-PHP":{"awarded":true,"count":1,"lost":false},"scenario-114":{"state":"complete"},"achievement-PAD":{"awarded":true,"count":1,"lost":false},"scenario-113":{"state":"complete"},"achievement-GPA":{"awarded":true,"count":2,"lost":false},"achievement-GPA2":{"awarded":true,"count":1,"lost":false},"scenario-115":{"state":"complete","treasures":["96"]},"achievement-GST":{"awarded":true,"count":1,"lost":false},"scenario-90":{"state":"incomplete"},"scenario-80":{"state":"incomplete"},"scenario-59":{"state":"complete"},"scenario-60":{"state":"incomplete"},"scenario-55":{"state":"incomplete"}}');
        const newCampaignData = migrateVersion2Progress({...oldCampaignData});

        for (const [key, scenario] of Object.entries(oldCampaignData)) {
            if (key.startsWith('scenario')) {
                const id = key.replace('scenario-', '');
                const game = id <= 95 ? 'gh' : 'fc';
                const newKey = `scenario-${game}-${id}`;

                expect(scenario).eq(newCampaignData[newKey]);
                expect(newCampaignData.hasOwnProperty(key)).false;
            }
        }
    });

    it('It falls back to the main game when the stored game is not supported', () => {
        cy.visit('/tracker');
        cy.window().then((win) => win.localStorage.setItem('game', JSON.stringify('unknown')));
        cy.reload();

        utilities.completeScenario(1);
        cy.window().then((win) => {
            expect(win.app.game).eq('gh');
            expect(JSON.parse(win.localStorage.getItem('game'))).eq('gh');
        });
    });
});
