import utilities from "../utilities";

describe('Gloomhaven edition', () => {

    it('It replaces Gloomhaven with the 2nd edition in the game switch', () => {
        utilities.chooseEdition('gh2');

        cy.window().its('app.game').should('eq', 'gh2');
        cy.get('#gh-enabled').should('be.disabled');
        cy.get('.game-switch li[data-value="gh2"]').should('exist');
        cy.get('.game-switch li[data-value="gh"]').should('not.exist');

        utilities.chooseEdition('gh');

        cy.window().its('app.game').should('eq', 'gh');
        cy.get('.game-switch li[data-value="gh"]').should('exist');
        cy.get('.game-switch li[data-value="gh2"]').should('not.exist');
    });

    it('It offers the edition classes in other games and keeps their unlocks', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/party');
        cy.get('#character-BR').check({force: true});

        utilities.chooseEdition('gh2');
        cy.window().its('app.game').should('eq', 'fh');
        cy.visit('/tracker/#/party');
        cy.get('#character-BR2').should('exist');
        cy.get('#character-BR').should('not.exist');

        utilities.chooseEdition('gh');
        cy.visit('/tracker/#/party');
        cy.get('#character-BR').should('be.checked');
        cy.get('#character-BR2').should('not.exist');
    });

    it('It keeps 1st edition progress when switching editions', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter('Brute');
        // Runs the one-time sheet migrations first, they'd otherwise run on the first edition switch
        cy.reload();
        let sheet;
        cy.window().then((win) => sheet = Cypress._.omit(win.app.campaignData.sheet, ['edition', 'version', 'hash']));

        utilities.chooseEdition('gh2');
        cy.window().its('app.game').should('eq', 'gh2');
        cy.window().then((win) => {
            expect(Object.values(win.app.campaignData['sheet-gh2']?.characters || {})).to.have.length(0);
        });

        utilities.chooseEdition('gh');
        cy.window().its('app.game').should('eq', 'gh');
        cy.window().then((win) => {
            // Stored as uuid => class id
            expect(Object.values(win.app.campaignData.sheet.characters)).to.deep.eq(['BR']);
            expect(Cypress._.omit(win.app.campaignData.sheet, ['edition', 'version', 'hash'])).to.deep.eq(sheet);
        });
    });

    it('It keeps the 1st edition when an older client drops the edition from the sheet', () => {
        utilities.chooseEdition('gh2');
        cy.visit('/tracker/#/party');
        cy.get('#character-BR2').uncheck({force: true});
        cy.window().should((win) => expect(win.app.campaignData['sheet-gh2']).to.exist);
        utilities.chooseEdition('gh');
        cy.window().then((win) => {
            const blob = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            delete blob.sheet.edition;
            win.localStorage.setItem(win.app.campaignId, JSON.stringify(blob));
        });

        cy.reload();
        cy.window().its('app.game').should('eq', 'gh');
    });

    it('It keeps the edition when the campaign is reset', () => {
        utilities.chooseEdition('gh2');
        cy.get('#both-editions').check({force: true});
        cy.get('button').contains('Reset campaign').click();
        cy.get('.mdc-dialog--open button').contains('Clear all').click();

        cy.reload();
        cy.window().its('app.game').should('eq', 'gh2');
        cy.get('#both-editions').should('be.checked');
    });

    it('It hides both editions when Gloomhaven is turned off', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        utilities.chooseEdition('gh2');
        cy.get('#both-editions').check({force: true});
        cy.get('#gh-enabled').uncheck({force: true});

        cy.get('#gloomhaven-edition').should('not.exist');
        cy.get('.game-switch li[data-value="gh"]').should('not.exist');
        cy.get('.game-switch li[data-value="gh2"]').should('not.exist');

        cy.visit('/tracker/#/party');
        cy.get('#character-BR').should('not.exist');
        cy.get('#character-BR2').should('not.exist');

        cy.visit('/tracker/#/settings');
        cy.get('#gh-enabled').check({force: true});
        cy.get('#gloomhaven-edition').should('exist');
        cy.get('.game-switch li[data-value="gh2"]').should('exist');
    });

    it('It uses the 2nd Edition starting classes in Forgotten Circles', () => {
        cy.visit('/tracker/#/party');
        cy.get('#character-BR').should('be.checked');

        utilities.chooseEdition('gh2');
        utilities.enableGame('fc');
        utilities.switchGame('fc');

        cy.visit('/tracker/#/party');
        cy.get('#character-BR2').should('be.checked').and('be.disabled');
        cy.get('#character-BR').should('not.exist');
        cy.window().its('app.campaignData.sheet.characterUnlocks.BR').should('eq', true);

        cy.visit('/tracker/#/characters');
        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character a > span:last-child').each(span => expect(span.text().trim()).not.to.be.empty);
        cy.get('li.add-character').contains('Bruiser').should('exist');
    });

    it('It tells which campaign the edition applies to', () => {
        cy.visit('/tracker/#/settings');
        cy.get('#gloomhaven-edition').should('contain', 'Applies to this campaign (Local Campaign) only');
    });

    it('It announces the edition switch', () => {
        utilities.chooseEdition('gh2');
        cy.get('.toast').should('contain', 'Now showing Gloomhaven 2nd Edition');
    });

    it('It does not announce the edition in other games', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        utilities.chooseEdition('gh2');
        cy.window().its('app.game').should('eq', 'fh');
        cy.contains('Now showing').should('not.exist');
    });

    it('It lists a class of both editions once, named after the campaign edition', () => {
        // Given
        utilities.chooseEdition('gh2');
        cy.get('#both-editions').check({force: true});

        // When
        cy.visit('/tracker/#/party');

        // Then
        cy.get('#character-BR2').should('be.checked').and('be.disabled');
        cy.get('#character-BR').should('not.exist');
        cy.get('#character-DS2').should('exist');
        cy.get('#character-DS').should('not.exist');
        cy.get('#character-SU').should('exist');
        cy.get('#character-ST2').should('exist');

        cy.visit('/tracker/#/characters');
        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Bruiser').should('have.length', 1);
        cy.get('li.add-character').contains('Brute').should('not.exist');
    });

    it('It unlocks and locks a class in both editions at once', () => {
        // Given
        cy.visit('/tracker/#/settings');
        cy.get('#both-editions').check({force: true});
        cy.visit('/tracker/#/party');

        // When
        cy.get('#character-DS').check({force: true});

        // Then
        cy.get('.mdc-dialog--open').should('not.exist');
        cy.window().its('app.campaignData.sheet.characterUnlocks').should('deep.include', {DS: true, DS2: true});

        // When
        cy.get('#character-DS').uncheck({force: true});

        // Then
        cy.window().its('app.campaignData.sheet.characterUnlocks').should(unlocks => {
            expect([!!unlocks.DS, !!unlocks.DS2]).to.deep.eq([false, false]);
        });
    });

    it('It shows a class checked when only the other edition is unlocked', () => {
        // Given
        cy.visit('/tracker/#/settings');
        cy.get('#both-editions').check({force: true});
        cy.window().should((win) => expect(win.app.campaignData.sheet?.bothEditions).to.eq(true));
        cy.window().then((win) => {
            const blob = JSON.parse(win.localStorage.getItem(win.app.campaignId));
            blob.sheet.characterUnlocks = {...blob.sheet.characterUnlocks, DS2: true};
            win.localStorage.setItem(win.app.campaignId, JSON.stringify(blob));
        });

        // When
        cy.visit('/tracker/#/party');
        cy.reload();

        // Then
        cy.get('#character-DS').should('be.checked');
        cy.get('#character-DS2').should('not.exist');
    });

    it('It asks which edition to add for a class of both editions', () => {
        // Given
        cy.visit('/tracker/#/settings');
        cy.get('#both-editions').check({force: true});
        cy.visit('/tracker/#/characters');

        // When
        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Brute').click();
        cy.get('.mdc-dialog--open button').contains('Cancel').click();

        // Then
        cy.get('.mdc-dialog--open').should('not.exist');
        cy.window().then((win) => expect(Object.values(win.app.campaignData.sheet.characters || {})).to.have.length(0));

        // When
        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Brute').click();

        // Then
        cy.get('.mdc-dialog--open [id^=choose-edition-]').then(options => {
            expect([...options].map(option => option.id)).to.deep.eq(['choose-edition-BR', 'choose-edition-BR2']);
        });
        cy.get('#choose-edition-BR2').should('contain', 'Bruiser').and('contain', 'Gloomhaven 2nd Edition');

        // When
        cy.get('#choose-edition-BR2').click();

        // Then
        cy.window().its('app.campaignData.sheet.characters').then(characters => {
            expect(Object.values(characters)).to.deep.eq(['BR2']);
        });
    });

    it('It adds a class of one edition without asking', () => {
        // Given
        cy.visit('/tracker/#/settings');
        cy.get('#both-editions').check({force: true});
        cy.visit('/tracker/#/party');
        cy.get('#character-SU').check({force: true});
        cy.visit('/tracker/#/characters');

        // When
        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Summoner').click();

        // Then
        cy.get('.mdc-dialog--open').should('not.exist');
        cy.window().its('app.campaignData.sheet.characters').then(characters => {
            expect(Object.values(characters)).to.deep.eq(['SU']);
        });
    });

    it('It marks characters of the other edition', () => {
        // Given
        cy.visit('/tracker/#/settings');
        cy.get('#both-editions').check({force: true});
        cy.visit('/tracker/#/characters');
        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Brute').click();
        cy.get('#choose-edition-BR2').click();
        cy.get('.items-to-add-dropdown').click();
        cy.get('li.add-character').contains('Tinkerer').click();
        cy.get('#choose-edition-TI').click();

        // Then
        cy.get('#desktop-character-menu .edition-badge').should('have.length', 1).and('have.text', '2e');
        cy.get('#desktop-character-menu li').contains('Bruiser').parent().find('.edition-badge').should('exist');

        // When
        cy.visit('/tracker/#/settings');
        cy.get('#both-editions').uncheck({force: true});
        cy.visit('/tracker/#/characters');

        // Then
        cy.get('#desktop-character-menu').should('exist');
        cy.get('.edition-badge').should('not.exist');
    });
});
