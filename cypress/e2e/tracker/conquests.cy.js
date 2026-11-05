import utilities from "../utilities";

// Prosperity 5 starts at this prosperity index.
const prosperity5 = {gh: 23, gh2: 34, fh: 43};
const reward = 'Open a class or building envelope of your choice.';

// Merge values into a stored campaign sheet and reload so the app reads them.
function seedSheet(key, values) {
    cy.window().then((win) => {
        const data = JSON.parse(win.localStorage.getItem(win.app.campaignId)) || {};
        data[key] = {...(data[key] || {}), ...values};
        win.localStorage.setItem(win.app.campaignId, JSON.stringify(data));
    });
    cy.reload();
}

function openCharacterWithProsperity(sheetKey, prosperityIndex, character = 'Cragheart') {
    cy.visit('/tracker/#/characters');
    seedSheet(sheetKey, {prosperityIndex});
    utilities.openCharacter(character);
    utilities.scrollTo('60%');
}

function selectQuest(label) {
    // "ConQuests 04": the printed number narrows the dropdown to one card
    cy.get(`input[name="personal-quests"]`).type(label.slice(0, 12), {scrollBehavior: false});
    cy.get('li').contains(label).click({scrollBehavior: false});
}

describe('ConQuests personal quests', () => {

    it('It is off by default', () => {
        openCharacterWithProsperity('sheet', prosperity5.gh);

        cy.get(`input[name="personal-quests"]`).type('Conquer', {scrollBehavior: false});
        cy.get('li').contains('Conquer Your Demons').should('not.exist');
    });

    it('It hides the cards below prosperity 5', () => {
        utilities.enableGame('cq');
        openCharacterWithProsperity('sheet', prosperity5.gh - 1);

        cy.get(`input[name="personal-quests"]`).type('Conquer', {scrollBehavior: false});
        cy.get('li').contains('Conquer Your Demons').should('not.exist');
    });

    it('It selects and tracks Conquer Your Demons', () => {
        utilities.enableGame('cq');
        openCharacterWithProsperity('sheet', prosperity5.gh);
        selectQuest('ConQuests 01 Conquer Your Demons');

        cy.contains('Kill two Earth Demons spawned this way.');
        cy.contains(reward).should('not.exist');

        for (let part = 0; part < 6; part++) {
            cy.get(`#pq-${part}-0`).click();
            cy.get(`#pq-${part}-1`).click();
        }
        cy.contains(reward);

        cy.get('img[alt="Conquer Your Demons"]').click();
        cy.get('h2').contains('Personal Quest ConQuests 01');
    });

    it('It tracks number progress for Consequences of Combat', () => {
        utilities.enableGame('cq');
        openCharacterWithProsperity('sheet', prosperity5.gh);
        selectQuest('ConQuests 03 Consequences of Combat');

        cy.get('input[aria-labelledby="pq-0"]').clear({force: true}).type('49{enter}', {force: true});
        cy.contains(reward).should('not.exist');
        cy.get('input[aria-labelledby="pq-0"]').clear({force: true}).type('50{enter}', {force: true});
        cy.contains(reward);
    });

    it('It keeps a held card after the pack is turned off', () => {
        utilities.enableGame('cq');
        openCharacterWithProsperity('sheet', prosperity5.gh);
        selectQuest('ConQuests 02 Your Friends Are Concerned');
        cy.get('input[aria-labelledby="pq-0"]').clear({force: true}).type('5{enter}', {force: true});

        cy.visit('/tracker/#/settings');
        cy.get('#cq-enabled').uncheck();

        cy.visit('/tracker/#/characters');
        utilities.scrollTo('60%');
        cy.contains('ConQuests 02 Your Friends Are Concerned');
        cy.get('input[aria-labelledby="pq-0"]').should('have.value', '5');
    });

    it('It does not draw a card another character holds', () => {
        utilities.enableGame('cq');
        openCharacterWithProsperity('sheet', prosperity5.gh);
        selectQuest('ConQuests 04 A Dramatic Conclusion');

        utilities.openCharacter('Spellweaver');
        utilities.scrollTo('60%');
        // Pick the last quest in the pool: ConQuests 04 unless held quests are excluded.
        cy.window().then((win) => cy.stub(win.Math, 'random').returns(0.9999));
        cy.get('button').contains('Draw').click({scrollBehavior: false});

        cy.contains('ConQuests 03 Consequences of Combat');
    });

    it('It does not share progress between games', () => {
        utilities.enableGame('cq');
        utilities.enableGame('fh');
        cy.visit('/tracker/#/characters');
        seedSheet('campaign-fh', {prosperityIndex: prosperity5.fh});
        seedSheet('sheet', {prosperityIndex: prosperity5.gh});
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

    it('It offers the cards in Frosthaven', () => {
        utilities.enableGame('cq');
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        openCharacterWithProsperity('campaign-fh', prosperity5.fh, 'Blinkblade');
        selectQuest('ConQuests 04 A Dramatic Conclusion');

        cy.get('#pq-0-9').should('exist');
    });

    it('It offers the cards in Gloomhaven 2nd Edition', () => {
        utilities.enableGame('cq');
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');
        openCharacterWithProsperity('sheet-gh2', prosperity5.gh2, 'Bruiser');
        selectQuest('ConQuests 02 Your Friends Are Concerned');

        cy.contains('Earn 30 checkmarks from Battle Goals.');
    });
});
