import utilities from "../utilities";

// Merge values into a stored campaign sheet and reload so the app reads them.
function seedSheet(key, values) {
    cy.window().then((win) => {
        const data = JSON.parse(win.localStorage.getItem(win.app.campaignId));
        data[key] = {...(data[key] || {}), ...values};
        win.localStorage.setItem(win.app.campaignId, JSON.stringify(data));
    });
    cy.reload();
}

// Prosperity 5 starts at prosperity index 23 in Gloomhaven and 43 in Frosthaven.
const ghProsperity5 = 23;
const fhProsperity5 = 43;

function selectQuest(label) {
    cy.get(`input[name="personal-quests"]`).type('ConQuests', {scrollBehavior: false});
    cy.get('li').contains(label).click({scrollBehavior: false});
}

describe('ConQuests personal quests', () => {

    it('It hides ConQuests when the setting is off', () => {
        cy.visit('/tracker/#/characters');
        seedSheet('sheet', {prosperityIndex: ghProsperity5});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        cy.get(`input[name="personal-quests"]`).type('Conquer', {scrollBehavior: false});
        cy.get('li').contains('Conquer Your Demons').should('not.exist');
    });

    it('It hides ConQuests below prosperity 5', () => {
        cy.visit('/tracker/#/characters');
        seedSheet('sheet', {conquestsEnabled: true, prosperityIndex: ghProsperity5 - 1});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        cy.get(`input[name="personal-quests"]`).type('Conquer', {scrollBehavior: false});
        cy.get('li').contains('Conquer Your Demons').should('not.exist');
    });

    it('It can select and track Conquer Your Demons', () => {
        cy.visit('/tracker/#/characters');
        seedSheet('sheet', {conquestsEnabled: true, prosperityIndex: ghProsperity5});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        selectQuest('ConQuests 01 Conquer Your Demons');

        cy.contains('Kill two Earth Demons spawned this way.');
        cy.contains('Kill two Wind Demons spawned this way.');
        cy.contains('Open a class or building envelope of your choice.').should('not.exist');

        for (let part = 0; part < 6; part++) {
            cy.get(`#pq-${part}-0`).click();
            cy.get(`#pq-${part}-1`).click();
        }
        cy.contains('Open a class or building envelope of your choice.');

        cy.get('img[alt="Conquer Your Demons"]').click();
        cy.get('h2').contains('Personal Quest ConQuests 01');
    });

    it('It tracks number progress for Consequences of Combat', () => {
        cy.visit('/tracker/#/characters');
        seedSheet('sheet', {conquestsEnabled: true, prosperityIndex: ghProsperity5});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        selectQuest('ConQuests 03 Consequences of Combat');

        cy.get('input[aria-labelledby="pq-0"]').clear({force: true}).type('49{enter}', {force: true});
        cy.contains('Open a class or building envelope of your choice.').should('not.exist');
        cy.get('input[aria-labelledby="pq-0"]').clear({force: true}).type('50{enter}', {force: true});
        cy.contains('Open a class or building envelope of your choice.');
    });

    it('It keeps a held ConQuests card after the setting is turned off', () => {
        cy.visit('/tracker/#/characters');
        seedSheet('sheet', {conquestsEnabled: true, prosperityIndex: ghProsperity5});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        selectQuest('ConQuests 02 Your Friends Are Concerned');
        cy.get('input[aria-labelledby="pq-0"]').clear({force: true}).type('5{enter}', {force: true});

        seedSheet('sheet', {conquestsEnabled: false});

        cy.get('#desktop-character-menu').contains('Cragheart').click();
        utilities.scrollTo('60%');
        cy.contains('ConQuests 02 Your Friends Are Concerned');
        cy.get('input[aria-labelledby="pq-0"]').should('have.value', '5');
    });

    it('It does not draw a ConQuests card another character holds', () => {
        cy.visit('/tracker/#/characters');
        seedSheet('sheet', {conquestsEnabled: true, prosperityIndex: ghProsperity5});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        selectQuest('ConQuests 04 A Dramatic Conclusion');

        utilities.openCharacter('Spellweaver');
        utilities.scrollTo('60%');
        // Pick the last quest in the pool: that's ConQuests 04 unless held quests are excluded.
        cy.window().then((win) => cy.stub(win.Math, 'random').returns(0.9999));
        cy.get('button').contains('Draw').click({scrollBehavior: false});

        cy.contains('ConQuests 03 Consequences of Combat');
    });

    it('It disables a ConQuests card another character holds in search', () => {
        cy.visit('/tracker/#/characters');
        seedSheet('sheet', {conquestsEnabled: true, prosperityIndex: ghProsperity5});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        selectQuest('ConQuests 04 A Dramatic Conclusion');

        utilities.openCharacter('Spellweaver');
        utilities.scrollTo('60%');
        cy.get(`input[name="personal-quests"]`).type('ConQuests', {scrollBehavior: false});
        cy.get('li').contains('A Dramatic Conclusion').closest('span').should('have.class', 'opacity-50');
        cy.get('li').contains('Conquer Your Demons').closest('span').should('not.have.class', 'opacity-50');
    });

    it('It finds ConQuests cards by their printed number', () => {
        cy.visit('/tracker/#/characters');
        seedSheet('sheet', {conquestsEnabled: true, prosperityIndex: ghProsperity5});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        cy.get(`input[name="personal-quests"]`).type('03', {scrollBehavior: false});
        cy.get('li').contains('ConQuests 03 Consequences of Combat');
    });

    it('It does not share ConQuests progress between games', () => {
        utilities.enableGame('fh');
        cy.visit('/tracker/#/characters');
        seedSheet('campaign-fh', {conquestsEnabled: true, prosperityIndex: fhProsperity5});
        seedSheet('sheet', {conquestsEnabled: true, prosperityIndex: ghProsperity5});

        utilities.openCharacter();
        utilities.scrollTo('60%');
        selectQuest('ConQuests 01 Conquer Your Demons');
        cy.get('#pq-0-0').click();

        // Switch game in-app, without reloading the page.
        cy.window().then((win) => win.app.$bus.$emit('game-selected', 'fh'));
        utilities.openCharacter('Blinkblade');
        utilities.scrollTo('60%');
        selectQuest('ConQuests 01 Conquer Your Demons');
        cy.get('#pq-0-0').should('not.be.checked');
    });

    it('It offers ConQuests in Frosthaven', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/characters');
        seedSheet('campaign-fh', {conquestsEnabled: true, prosperityIndex: fhProsperity5});

        utilities.openCharacter('Blinkblade');
        utilities.scrollTo('60%');
        selectQuest('ConQuests 04 A Dramatic Conclusion');

        cy.contains('Win 10 scenarios where your last two actions are a top loss action and a bottom loss action.');
        cy.get('#pq-0-9').should('exist');
    });

});
