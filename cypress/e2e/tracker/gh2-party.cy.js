import utilities from "../utilities";

describe('Party GH2', () => {
    beforeEach(() => {
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');
    });

    it('It loads the campaign sheet', () => {
        cy.visit('/tracker/#/party');

        ['Campaign sheet', 'Inspiration', 'Demons', 'Merchant\'s Guild', 'Military', 'Prosperity',
            'Imbuement', 'Sanctuary', 'City Event Decks', 'Road Event Decks', 'Unlocks', 'notes']
            .forEach(text => cy.contains(text));
        cy.contains('Shop modifier').should('not.exist');
    });

    it('It caps faction reputation at 12 until unlocked and adds C-57 at 13', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="demons"]').clear().type('15{enter}').should('have.value', '12');
        cy.get('input#unlock17').click();
        cy.get('input[aria-labelledby="demons"]').clear().type('13{enter}');
        cy.get('input#unlock0').should('be.checked');
        cy.get('#city-events-bedges .bedge').contains('57').should('be.visible');
    });

    it('It adds the reputation 9 section events', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="military"]').clear().type('9{enter}');
        cy.get('input#unlock14').should('be.checked');
        cy.get('input#unlock8').should('not.be.checked');
        cy.contains('#city-events-bedges .bedge', /^\s*47\s*$/);
        cy.contains('#city-events-bedges .bedge', /^\s*48\s*$/).should('not.exist');
    });

    it('It adds the prosperity section events', () => {
        cy.visit('/tracker/#/party');

        cy.get('input#p-23').click();
        ['21', '28'].forEach(event => cy.contains('#city-events-bedges .bedge', new RegExp(`^\\s*${event}\\s*$`)));
        ['21', '25'].forEach(event => cy.contains('#road-events-bedges .bedge', new RegExp(`^\\s*${event}\\s*$`)));
        cy.contains('#city-events-bedges .bedge', /^\s*29\s*$/).should('not.exist');
    });

    it('It awards reputation threshold achievements', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="military"]').clear().type('6{enter}');
        utilities.achievements().then((achievements) => {
            expect(achievements.firstWhere('id', 'P2RMI6').awarded).eq(true);
            expect(achievements.firstWhere('id', 'P2RMI12').awarded).eq(false);
        });
    });

    it('It has gh2 prosperity levels', () => {
        cy.visit('/tracker/#/party');

        cy.get('span').contains('025–032').prev().find('input').should('not.be.checked');
        cy.get('input#p-13').click();
        cy.get('span').contains('025–032').prev().find('input').should('be.checked');
        cy.contains('48.2');
        cy.get('input#p-90').should('exist');
        cy.get('input#p-91').should('not.exist');
    });

    it('It counts Great Oak donations', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="donations"]').clear().type('100{enter}');
        cy.contains('2 gained prosperity');
    });

    it('It adds the prosperity section events when donation boxes count toward it', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="donations"]').clear().type('1000{enter}');
        cy.get('input#p-21').should('be.checked').and('be.disabled');
        cy.get('input#p-22').should('not.be.checked').and('not.be.disabled');
        cy.contains('#city-events-bedges .bedge', /^\s*21\s*$/).should('not.exist');

        cy.get('input#p-23').click();
        cy.get('input#p-22').should('be.checked');
        ['21', '28'].forEach(event => cy.contains('#city-events-bedges .bedge', new RegExp(`^\\s*${event}\\s*$`)));
    });

    it('It draws and resolves a 3-option city event', () => {
        cy.visit('/tracker/#/party');

        utilities.scrollTo('50%');
        cy.contains('#city-events-bedges .bedge', /^\s*2\s*$/).click();
        cy.get('.mdc-dialog__title').contains('City Event #2');
        cy.get('.mdc-dialog__content button').contains('C').click();
        cy.get('.mdc-dialog__content button').contains('Toggle A/B');
        // Removing is ignored while the flip animation runs.
        cy.wait(700);
        cy.get('.mdc-dialog__content button img[alt="Remove #2"]').click();
        cy.contains('#city-events-bedges .bedge', /^\s*2\s*$/).should('not.exist');
    });

    it('It shows a single-outcome city event without a toggle', () => {
        cy.visit('/tracker/#/party');

        utilities.scrollTo('50%');
        cy.contains('#city-events-bedges .bedge', /^\s*8\s*$/).click();
        cy.get('.mdc-dialog__content button').contains('A').click();
        cy.get('.mdc-dialog__content button').contains('Toggle').should('not.exist');
    });

    it('It adds class events when a class is unlocked', () => {
        cy.visit('/tracker/#/party');

        cy.get('input#character-NS2').click();
        cy.get('#road-events-bedges .bedge').contains('46').should('be.visible');
        cy.get('#city-events-bedges .bedge').contains('81').should('be.visible');
    });

    it('It adds class events when a personal quest unlocks a class', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter('Bruiser');
        utilities.scrollTo('60%');

        cy.get('input[name="personal-quests"]').type('3');
        cy.get('li').contains('#003 Augmented Abilities').click();
        [0, 1, 2, 3, 4].forEach((i) => cy.get('#pq-0-' + i).click());
        cy.get('#pq-1-0').click();

        cy.contains('Unlocked:');
        cy.window().then((win) => {
            const sheet = win.app.campaignData['sheet-gh2'];
            expect(sheet.characterUnlocks).to.have.property('ST2', true);
            expect(sheet.road).to.have.property('44', true);
            expect(sheet.road).to.have.property('45', true);
        });
    });

    it('It stores the campaign sheet', () => {
        cy.visit('/tracker/#/party');

        cy.get('input[aria-labelledby="inspiration"]').clear().type('7{enter}');
        cy.get('input[aria-labelledby="military"]').clear().type('-4{enter}');
        cy.get('input[aria-labelledby="imbuement"]').clear().type('10{enter}');
        cy.reload();

        cy.get('input[aria-labelledby="inspiration"]').should('have.value', '7');
        cy.get('input[aria-labelledby="military"]').should('have.value', '-4');
        cy.get('input[aria-labelledby="imbuement"]').should('have.value', '10');
        cy.contains('133.2');
    });

    it('It tracks a gh2 personal quest and opens its card', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter('Bruiser');
        utilities.scrollTo('60%');

        cy.get('input[name="personal-quests"]').type('5');
        cy.get('li').contains('#005 Seeker of Xorn').click();
        cy.contains('Gain a level to unlock');
        cy.get('span').contains('Hidden Scenario');

        cy.get('#pq-0-0').click();
        cy.get('span').contains('57 Crypt Basement');

        cy.get('img[alt="Seeker of Xorn"]').click();
        cy.get('h2').contains('Personal Quest #5');
        cy.get('img[src*="/img/cards/gh2/quest/5."]').should('exist');
    });

    it('It re-locks open quest scenarios when a character is abandoned', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter('Bruiser');
        utilities.scrollTo('60%');

        cy.get('input[name="personal-quests"]').type('5');
        cy.get('li').contains('#005 Seeker of Xorn').click();
        cy.get('#pq-0-0').click();
        cy.get('span').contains('57 Crypt Basement');
        cy.window().then((win) => {
            win.app.scenarioRepository.setComplete(win.app.scenarios.firstWhere('id', 57));
        });
        ['pq-1-0', 'pq-2-0', 'pq-2-1', 'pq-2-2', 'pq-2-3', 'pq-2-4', 'pq-2-5', 'pq-2-6']
            .forEach((id) => cy.get('#' + id).click());
        cy.get('span').contains('58 ');

        cy.get('button').contains('Abandon').click();
        cy.get('.mdc-dialog--open').contains('Retiring or abandoning permanently removes this character');
        cy.get('.mdc-dialog--open a[href*="campaigns"]').contains('Please consider purchasing a license');
        cy.get('#abandon-character').click();

        cy.window().then((win) => {
            // Completed quest scenarios stay complete, open ones are locked again
            expect(win.app.scenarios.firstWhere('id', 57).isComplete()).to.be.true;
            expect(win.app.scenarios.firstWhere('id', 58).isHidden()).to.be.true;
            // Abandoning isn't a retirement
            expect(win.app.campaignData['sheet-gh2'].unlocks).not.to.have.property('7');
        });
    });

    it('It adds city events from a personal quest step', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter('Bruiser');
        utilities.scrollTo('60%');

        cy.get('input[name="personal-quests"]').type('1');
        cy.get('li').contains('#001').click();
        cy.get('#pq-0-0').click();

        cy.window().then((win) => {
            expect(win.app.campaignData['sheet-gh2'].city).to.have.property('61', true);
        });
    });

    it('It keeps quest scenarios when a character retires with a completed quest', () => {
        cy.visit('/tracker/#/characters');

        utilities.openCharacter('Bruiser');
        utilities.scrollTo('60%');

        cy.get('input[name="personal-quests"]').type('5');
        cy.get('li').contains('#005 Seeker of Xorn').click();
        ['pq-0-0', 'pq-1-0', 'pq-2-0', 'pq-2-1', 'pq-2-2', 'pq-2-3', 'pq-2-4', 'pq-2-5', 'pq-2-6', 'pq-3-0']
            .forEach((id) => cy.get('#' + id).click());
        cy.contains('Unlocked:');

        cy.get('button').contains('Retire').click();
        cy.get('#retire-character').click();

        cy.window().then((win) => {
            expect(win.app.scenarios.firstWhere('id', 57).isHidden()).to.be.false;
            // The first retirement reads section 68.4
            expect(win.app.campaignData['sheet-gh2'].unlocks).to.have.property('7', true);
        });
    });

    it('It keeps the gh sheet free of gh2 fields', () => {
        utilities.chooseEdition('gh');
        cy.visit('/tracker/#/party');
        cy.get('input#p-5').click();

        cy.window().then((win) => {
            const sheet = win.app.campaignData['sheet'];
            expect(sheet).to.have.property('prosperityIndex');
            ['factionReputation', 'inspiration', 'imbuement'].forEach(key => expect(sheet).not.to.have.property(key));
        });
    });
});
