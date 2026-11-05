import utilities from "../utilities";

describe('Character', () => {

    it('It loads the character sheet', () => {
        cy.visit('/tracker/#/characters');

        cy.get('input[name="name"]').should('have.value', 'Brute');
        cy.contains('Perks');
        cy.contains('Remove two cards');
        cy.contains('Items');
        cy.contains('Battle Goals');
        cy.contains('Additional notes');
        cy.contains('Retire');
    });

    it('It can add a character', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        cy.contains('Ignore negative scenario effects');
    });

    it('It can have one character in a party at the time', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Cragheart').contains('Cragheart').parent().should('have.class', 'grayscale');
    });

    it('It can choose a retired character\'s class again', () => {
        const story = {id: 1, name: 'Synced', data: {}, expires_at: '2099-01-01'};
        cy.intercept('PUT', '**/stories/1', (req) => req.reply(story));

        // A cloud campaign archives retired characters instead of removing them.
        cy.visit('/tracker/#/characters');
        cy.window().then((win) => {
            win.localStorage.setItem('campaignId', JSON.stringify('_1'));
            win.localStorage.setItem('stories', JSON.stringify([story]));
        });
        cy.reload();

        utilities.openCharacter();
        cy.get('button').contains('Retire').click();
        cy.get('.mdc-dialog.mdc-dialog--open button').contains('Retire').click();

        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Cragheart').parent().should('not.have.class', 'grayscale');
        cy.get('li.add-character').contains('Cragheart').click();
        cy.window().then((win) => {
            const sheet = win.app.campaignData.sheet;
            expect(Object.values(sheet.characters)).to.deep.eq(['CH']);
            expect(Object.values(sheet.archivedCharacters)).to.deep.eq(['CH']);
            // The first Cragheart retirement adds City and Road event 46, once
            expect(sheet.city).to.have.property('46', true);
            expect(sheet.road).to.have.property('46', true);
            expect(sheet.classEventsAdded).to.deep.eq({CH: ['retire']});
        });
    });

    it('It archives an abandoned character in a cloud campaign', () => {
        const story = {id: 1, name: 'Synced', data: {}, expires_at: '2099-01-01'};
        cy.intercept('PUT', '**/stories/1', (req) => req.reply(story));
        cy.visit('/tracker/#/characters');
        cy.window().then((win) => {
            win.localStorage.setItem('campaignId', JSON.stringify('_1'));
            win.localStorage.setItem('stories', JSON.stringify([story]));
        });
        cy.reload();

        utilities.openCharacter();
        cy.get('button').contains('Abandon').click();
        cy.get('.mdc-dialog--open').contains('It\'s archived, so you can restore or remove it later.');
        cy.get('#abandon-character').click();

        cy.window().then((win) => {
            const sheet = win.app.campaignData.sheet;
            expect(sheet.characters).to.deep.eq({});
            expect(Object.values(sheet.archivedCharacters)).to.deep.eq(['CH']);
            // Abandoning adds no class events
            expect(sheet).not.to.have.property('classEventsAdded');
            expect(sheet.city['46']).not.to.eq(true);
        });
        cy.get('button').contains('Restore').should('exist');
    });

    it('It adds the class events when a class is unlocked', () => {
        cy.visit('/tracker/#/party');
        utilities.scrollTo('100%', true);
        cy.get('#character-SK').click();

        cy.window().then((win) => {
            const sheet = win.app.campaignData.sheet;
            expect(sheet.city).to.have.property('31', true);
            expect(sheet.road).to.have.property('31', true);
        });
    });

    it('It adds the class events of a chosen Crimson Scales starting class', () => {
        utilities.enableGame('cs');
        utilities.switchGame('cs');
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Bombard');

        cy.window().then((win) => {
            const sheet = win.app.campaignData['sheet-cs'];
            expect(sheet.city).to.have.property('39', true);
            expect(sheet.road).to.have.property('39', true);
        });
    });

    it('It opens the character mat and flips it', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        cy.get('#character-art').click();
        cy.get('#character-mat img[src*="character-mats/gh/CH-front"]').should('exist');
        cy.get('#character-mat .inner').should('not.have.class', 'flipped');

        cy.get('#flip-character-mat').click();
        cy.get('#character-mat .inner').should('have.class', 'flipped');
    });

    it('It hides the character mat for characters without one', () => {
        cy.visit('/tracker/#/party');
        utilities.scrollTo('100%', true);
        cy.get('#character-SA').click();

        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Satha');

        cy.get('input[name="name"]').should('have.value', 'Satha');
        cy.get('#character-art').should('not.exist');
    });

    it('It can change the character name', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        cy.get('input[name="name"]').clear().type("Test").blur();
        cy.get('li').contains('Test').should('be.visible');
    });

    it('It can change level, xp and gold', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        // LVL
        cy.contains('Lvl 2');
        cy.contains('45 XP');
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('2{enter}');
        cy.contains('Lvl 3');
        cy.contains('95 XP');

        // XP
        cy.get('input[aria-labelledby="xp"]').clear({force: true}).type('100{enter}');
        cy.contains('Level up when you\'re back in town!');

        // Gold
        cy.get('input[aria-labelledby="gold"]').clear({force: true}).type('20{enter}');
    });

    it('It can add items', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        // Show first 10 items by default, can add them without typing anything
        cy.get('input[name="items"]').click();
        cy.get('li').contains('Boots of Striding').click();
        utilities.closeModel();
        cy.get('#items-bedges').contains('Boots of Striding');

        // Search items by their name
        cy.get('input[name="items"]').click().type('Minor');
        cy.get('li').contains('Minor Healing Potion').click();
        utilities.closeModel();
        cy.get('#items-bedges').contains('Minor Healing Potion');

        // Search items by their id
        cy.get('input[name="items"]').click().clear().type('11{enter}');
        cy.get('li').contains('Poison Dagger').click();
        utilities.closeModel();
        cy.get('#items-bedges').contains('Poison Dagger');
    });

    it('It can check perks', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('0%');

        for (let i = 0; i <= 9; i++) {
            cy.get(`#perk-${i}-0`).click({scrollBehavior: false});
        }

        utilities.scrollTo('60%');
        cy.get('#open-modifier-deck').click({scrollBehavior: false});
        cy.contains('Attack Modifier Deck');

        utilities.assertCount('.mdc-dialog__content ul.grid li', 12);
    });

    it('It can check battle goals', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        for (let i = 1; i <= 3; i++) {
            cy.get(`#check${i}`).click({scrollBehavior: false});
        }
        cy.contains('You may select an additional perk!');
    });

    it('It can\'t add more items then there is stock', () => {
        // Campaign with Brute and Cragheart #001 Boots of Striding
        utilities.visitShared('/tracker/#/shared/1/local/N4Rozg5gFgtAjAIgFyjAFxASwL4BpwBmAxjAJwBsyqGO+YUwCAhgE5FSYBuApgCYDCUVkyJpuLMFTwJ2w0eICqAOwA2AeyIBrSSgQAhAErIQcXAn4AJY6YQBlAOrWzAFQCSTu-w8BZZ9bwgsowALADMABxE4XCkwTAEoXBxwXBw4TAARrxw5DAA7OThAAykBMFE5EwZecj6RmahRTHBTOR5MERMebwwwQBMRNwwTKVwMMXlTMHcGX3cYbWWCNJEmGgAnlQIiEgmZn0eoR7BHgCsHpS7NjVXZuEepB5wRU87e9sHt9tHX0lP579Lu84Ddgfdfo8vn0XlC3jY+p93n0fkiTlCAUigfDQfDwUjIe9Gv58JheMAAgAHTA2FhqJi8LZw-aHY5nC4eHF3B5PGHApkfJ4omx-X4Y4VYswgp544UE+G8+H8hEeZEqtFIsX7CUIPqcnUy-ZyhoKgIAV3JKyELBEYhYvQiUWa8USyVS6SyOXyhRKZQqVRujHY3C0OnJZggahUDKQRTMpNqhgQcbEAFtQ9tiQgVNweCpkDYlEwU9wEyxTWIkwgKeJtFsYQBtEBFAC6kuQjZbzKQHfwnYQPw7rYQaJ7TaHAMHZkuo77N0nCHBM6HkPnz3bY+kptN8aQw4d0VizqSvTdmWyuQKxVK5Uq1UrAA8Kcgipa5LaYI1mq12p1ur0BkMIwEGMEydNMszzD8gZQMGtYoNIEZRs+cbRuYVjJtwaaMpm2a5vmZiFsWizWtA3CsGglbViwcGMA2Y5tt2Ta9r2Q6fPOA5MfRw7rrGXETlx06cbOPFDouXErhuZhbju-ZNLE34dF0PT9IMwyjOMRSTOBcwLGYj7Ptg2BAA/characters');

        utilities.openCharacter('Spellweaver');

        cy.get('input[name="items"]').click();
        cy.get('li').contains('Boots of Striding').click().parent().parent().should('have.class', 'opacity-50');

        cy.get('#items-bedges').contains('Boots of Striding').should('not.exist');
    });

    it('It can track personal quests', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');

        cy.get(`input[name="personal-quests"]`).type("510");
        cy.get('li').contains('#510 Seeker of Xorn').click();

        cy.get(`input[name="personal-quests"]`).should('not.exist');
        cy.contains('Complete three Crypt scenarios.');

        cy.get('#pq-0-0').click();
        cy.get('button').contains('Remove #510');
        cy.get('p').contains('Unlocked').should('not.exist');
        cy.get('span').contains('Conclude Hidden Scenario');

        cy.get('#pq-0-1').click();
        cy.get('#pq-0-2').click();
        cy.get('span').contains('Conclude 52 Noxious Cellar');
        cy.get('span').contains('Conclude Hidden Scenario').should('not.exist');
        cy.get('#pq-0-2').click();
        cy.get('#pq-0-2').click();
        cy.get('#pq-1-0').click();
        cy.get('p').contains('Unlocked');
    });

    it('It pads stored personal quest progress to the quest data length', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');
        cy.get(`input[name="personal-quests"]`).type("510");
        cy.get('li').contains('#510 Seeker of Xorn').click();
        cy.get('#pq-0-0').click();

        // Simulate progress stored before the quest gained checkboxes
        cy.window().then((window) => {
            const campaignData = JSON.parse(window.localStorage.getItem(window.app.campaignId));
            const characterKey = Object.keys(campaignData).find(key => key.startsWith('character-'));
            campaignData[characterKey].quest.progress[0] = [true];
            window.localStorage.setItem(window.app.campaignId, JSON.stringify(campaignData));
        });
        cy.reload();

        cy.get('#pq-0-0').should('be.checked');
        cy.get('#pq-0-1').should('not.be.checked');
        cy.get('#pq-0-2').should('not.be.checked');
    });

    it('It skips stored characters of an unknown class', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();

        // Simulate a class this version doesn't know, e.g. stored by a newer version
        let characterKey;
        cy.window().then((window) => {
            const campaignData = JSON.parse(window.localStorage.getItem(window.app.campaignId));
            characterKey = Object.keys(campaignData).find(key => key.startsWith('character-'));
            campaignData[characterKey].id = 'XX2';
            window.localStorage.setItem(window.app.campaignId, JSON.stringify(campaignData));
        });
        cy.reload();

        cy.get('input[name="name"]').should('have.value', 'Brute');
        cy.get('#desktop-character-menu').should('not.contain', 'Cragheart');

        // Storing the sheet keeps the unknown character for the version that knows it
        utilities.openCharacter('Spellweaver');
        cy.get('#desktop-character-menu').should('contain', 'Spellweaver');
        cy.window().then((window) => {
            const campaignData = JSON.parse(window.localStorage.getItem(window.app.campaignId));
            const uuid = characterKey.replace('character-', '');
            const sheet = Object.values(campaignData).find(value => value?.characters?.[uuid]);

            expect(sheet, 'sheet still lists the unknown character').to.exist;
            expect(campaignData[characterKey].id).to.equal('XX2');
        });
    });

    it('It can open solo scenario', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');
        cy.get('span').contains('Stone Defense').click();

        cy.get('#scenario-content label').contains('Complete').click();
        utilities.closeModel();
    });

    it('It can draw a random personal quest', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');

        cy.get('button').contains('Draw').click({scrollBehavior: false});

        cy.get(`input[name="personal-quests"]`).should('not.exist');
    });

    it('It opens personal quest card', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('60%');

        cy.get(`input[name="personal-quests"]`).click({scrollBehavior: false});
        cy.get('li').contains('#510 Seeker of Xorn').click({scrollBehavior: false});

        cy.get('img[alt="Seeker of Xorn"]').click({scrollBehavior: false});
        cy.get('h2').contains('Personal Quest #510');
    });

    it('It can track retirements', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter();
        utilities.scrollTo('80%');

        let message = 'You may select an additional perk!';

        cy.get('p').contains(message).should('not.exist');

        cy.get(`input[aria-labelledby="level"]`).clear({force: true}).type('2{enter}');

        cy.get('p').contains(message).should('exist');

        cy.get(`input[aria-labelledby="retirements"]`).clear({force: true}).type('1{enter}');

        cy.get('p').contains(message).should('exist');

        cy.get('#perk-8-0').click({force: true});

        cy.get('p').contains(message).should('exist');

        cy.get('#perk-9-0').click({force: true});

        cy.get('p').contains(message).should('not.exist');
    });

    it('It stores the character sheet', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();

        cy.get('input[name="name"]').clear().type("Test");
        cy.get('input[aria-labelledby="level"]').clear({force: true}).type('2{enter}');
        cy.get('input[aria-labelledby="xp"]').clear({force: true}).type('50{enter}');
        cy.get('input[aria-labelledby="gold"]').clear({force: true}).type('50{enter}');
        cy.get('#perk-0-0').click({force: true});
        cy.get('input[name="items"]').click();
        cy.get('li').contains('Boots of Striding').click();
        utilities.closeModel();
        utilities.scrollTo('60%');
        cy.get('#check1').click({force: true});
        cy.get('#notes').type('Foo Bar');
        utilities.closeModel();
        cy.get(`input[name="personal-quests"]`).click();
        cy.get('li').contains('#510 Seeker of Xorn').click();
        cy.get('#pq-0-0').click();
        cy.get('input[aria-labelledby="retirements"]').clear({force: true}).type('2{enter}');

        cy.reload();

        cy.get('input[name="name"]').should('have.value', 'Test');
        cy.get('input[aria-labelledby="level"]').should('have.value', '2');
        cy.get('input[aria-labelledby="xp"]').should('have.value', '50');
        cy.get('input[aria-labelledby="gold"]').should('have.value', '50');
        cy.get('#check1').should('be.checked');
        cy.get('#perk-0-0').should('be.checked');
        cy.get('#notes').should('have.value', 'Foo Bar');
        cy.get('h3').contains('#510 Seeker of Xorn');
        cy.get('#pq-0-0').should('be.checked');
        cy.get('input[aria-labelledby="retirements"]').should('have.value', '2');
    });

    it('cant update characters in read only mode', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();

        utilities.setReadOnly().then(() => {
            cy.get('input[name="name"]').should('be.disabled');
            cy.get('input[aria-labelledby="level"]').should('be.disabled');
            cy.get('input[aria-labelledby="xp"]').should('be.disabled');
            cy.get('input[aria-labelledby="gold"]').should('be.disabled');
            cy.get('#perk-0-0').should('be.disabled');
            cy.get('input[name="items"]').should('be.disabled');
            cy.get('#notes').should('be.disabled');
            cy.get('input[aria-labelledby="personal-quests"]').should('be.disabled');
            cy.get('input[aria-labelledby="retirements"]').should('be.disabled');
            cy.get('.items-to-add-dropdown').should('not.exist');
        });
    });

    it('It cant reorder characters in read only mode', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();

        // Reordering is only offered with a mouse.
        cy.window().then((win) => win.app.hasMouse = true);
        const sortableDisabled = (disabled) => cy.get('#desktop-character-menu ul.space-y-6')
            .should(($list) => expect(!!$list[0].__draggable_component__._sortable.option('disabled')).to.eq(disabled));

        sortableDisabled(false);
        utilities.setReadOnly().then(() => sortableDisabled(true));
    });

    it('removes a character by sending its key as null so the server deletes it', () => {
        const story = {id: 1, name: 'Synced', data: {}, expires_at: '2099-01-01'};
        let lastPayload = null;
        cy.intercept('PUT', '**/stories/1', (req) => {
            lastPayload = JSON.parse(req.body.data);
            req.reply(story);
        });

        // Seed a cloud campaign (not shared, so nothing is fetched at boot) and reload into it.
        cy.visit('/tracker/#/characters');
        cy.window().then((win) => {
            win.localStorage.setItem('campaignId', JSON.stringify('_1'));
            win.localStorage.setItem('stories', JSON.stringify([story]));
        });
        cy.reload();

        utilities.openCharacter();

        cy.window().then((win) => {
            const uuid = Object.keys(win.app.campaignData).find(key => key.startsWith('character-'));

            // Not a local campaign, so "Retire" archives instead of removing outright.
            cy.get('button').contains('Retire').click();
            cy.get('.mdc-dialog.mdc-dialog--open button').contains('Retire').click();

            // Now archived, "Remove" permanently deletes.
            cy.get('button').contains('Remove').click();
            cy.get('.mdc-dialog.mdc-dialog--open button').contains('Remove').click();

            cy.wrap(null).should(() => {
                expect(lastPayload).to.have.property(uuid, null);
            });
        });
    });

    it('It keeps a personal quest scenario unlocked when its goal is unchecked, and FH 65 locked until scenario 1', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/characters');

        utilities.openCharacter('Blinkblade');
        utilities.scrollTo('60%');
        cy.get(`input[name="personal-quests"]`).type('Aesther');
        cy.get('li').contains('Aesther Outpost').click();

        cy.get('#pq-0-0').click();
        utilities.scenarios().then((scenarios) => {
            expect(scenarios.firstWhere('id', 65).state).eq('required');
        });

        cy.get('#pq-0-0').click();
        utilities.scenarios().then((scenarios) => {
            expect(scenarios.firstWhere('id', 65).state).eq('required');
        });
    });
});
