import utilities from "../utilities";

describe('Enhancements', () => {

    function enableAndOpenAbility(id) {
        cy.visit('/tracker/#/characters');
        utilities.openAbilities();

        cy.get('#desktop-enable-enhancements').check();
        cy.get('#' + id).closest('.ability-card').click();
    }

    // Abilities above the character's level have no selection checkbox (no "available-<code>"
    // id), but their card image always renders, so target it by its image src instead.
    function openAbilityByImage(codeFragment) {
        cy.get('img[src*="' + codeFragment + '"]').closest('.ability-card').click();
    }

    // The page always has several other (closed) modals with their own "Cancel"/"Add" buttons,
    // so every button interaction here must be scoped to the open ability modal.
    function abilityModalButton(text) {
        return cy.get('.ability-modal').contains('button', text);
    }

    it('It shows the selected enhancement\'s icon, updating live as the type changes', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();

        cy.get('.ability-modal').contains('label', 'Enhancement')
            .find('img[src="/svg/icons/enhancements/attack.svg"]').should('exist');

        cy.get('#enhancement-type').select('poison');
        cy.get('.ability-modal').contains('label', 'Enhancement')
            .find('img[src="/svg/icons/enhancements/poison.svg"]').should('exist');

        // There's no generic "element" sticker on the sheet, only one per element: each
        // is its own option in the Enhancement select, each with its own icon.
        cy.get('#enhancement-type').select('fire');
        cy.get('.ability-modal').contains('label', 'Enhancement')
            .find('img[src="/svg/icons/enhancements/fire.svg"]').should('exist');

        cy.get('#enhancement-type').select('ice');
        cy.get('.ability-modal').contains('label', 'Enhancement')
            .find('img[src="/svg/icons/enhancements/ice.svg"]').should('exist');
    });

    it('It title-cases ALL CAPS translation keys but leaves already-cased labels untouched', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();

        cy.get('.ability-modal').contains('label', 'Enhancement')
            .find('option[value="poison"]').should('contain.text', 'Poison');
        cy.get('.ability-modal').contains('label', 'Enhancement')
            .find('option[value="wild_element"]').should('contain.text', 'Wild Element');

        // Stat-boost enhancements (Appendix D: "Attack +1", "Summon HP +1") get a "+1" suffix;
        // keyword ones (poison, wild element, above) don't.
        cy.get('.ability-modal').contains('label', 'Enhancement')
            .find('option[value="attack"]').should('contain.text', 'Attack +1');
        cy.get('.ability-modal').contains('label', 'Enhancement')
            .find('option[value="summon_hp"]').should('contain.text', 'Summon HP +1');
    });

    it('It can buy/add an enhancement, showing its icon and label in the list, and the repeat cost afterwards', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();

        cy.get('#enhancement-type').select('poison');
        cy.get('.ability-modal').contains('p', 'Cost: 75 Gold');
        abilityModalButton('Add').click();

        cy.get('.ability-modal').contains('Poison');
        cy.get('.ability-modal img[src="/svg/icons/enhancements/poison.svg"]').should('exist');
        // Both the modal's own preview and the background card show the sticker while the modal is open.
        cy.get('.ability-modal .enhancement-sticker').should('have.length', 1);

        // A second enhancement on the same ability adds the repeat penalty (+75 gold)
        abilityModalButton('Enhance').click();
        cy.get('#enhancement-type').select('poison');
        cy.get('.ability-modal').contains('p', 'Cost: 150 Gold');
        abilityModalButton('Cancel').click();

        cy.get('.ability-modal .material-icons').contains('clear').click();
        cy.get('.ability-modal').contains('Poison').should('not.exist');
        cy.get('.enhancement-sticker').should('not.exist');
    });

    it('It renders a generic "+1" sticker for stat-boost enhancements, keeping distinct icons for keyword ones', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();

        // "attack" is a stat-boost enhancement (Appendix D: "Attack +1"): its card sticker
        // shows "+1", not the attack icon, even though the select/list icon is unaffected.
        abilityModalButton('Add').click();
        cy.get('.ability-modal img[src="/svg/icons/enhancements/attack.svg"]').should('exist');

        // "poison" adds a keyword rather than boosting a printed stat: its sticker keeps its icon.
        abilityModalButton('Enhance').click();
        cy.get('#enhancement-type').select('poison');
        abilityModalButton('Add').click();

        cy.get('.ability-modal .enhancement-sticker').should('have.length', 2);
        cy.get('.ability-modal .enhancement-sticker').eq(0)
            .find('img[src="/svg/icons/enhancements/plus-one.svg"]').should('exist');
        cy.get('.ability-modal .enhancement-sticker').eq(1)
            .find('img[src="/svg/icons/enhancements/poison.svg"]').should('exist');
    });

    it('It applies the multi-target multiplier plus the ability-level penalty, without Frosthaven-only lost/persistent pricing', () => {
        cy.visit('/tracker/#/characters');
        utilities.openAbilities();
        cy.get('#desktop-enable-enhancements').check();
        cy.get('#desktop-show-all-abilities').check();

        // "explosive punch" is a level 2 Cragheart ability (above the character's starting
        // level, so it has no selection checkbox, only its card image).
        openAbilityByImage('explosive-punch');
        abilityModalButton('Enhance').click();

        // attack (50 gold) + level penalty for a level 2 ability (+25) = 75
        cy.get('.ability-modal').contains('p', 'Cost: 75 Gold');

        cy.get('#enhancement-multi-target').check();
        // (50 * 2) + 25 level penalty = 125
        cy.get('.ability-modal').contains('p', 'Cost: 125 Gold');

        // Lost/persistent multipliers are Frosthaven rules, so Gloomhaven doesn't offer them.
        cy.get('.ability-modal').contains('label', 'Ability property').should('not.exist');
    });

    it('It applies the lost and persistent multipliers in Frosthaven', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/characters');
        utilities.openAbilities('Blinkblade');
        cy.get('#desktop-enable-enhancements').check();
        cy.get('#desktop-show-all-abilities').check();

        // "blurry jab" is a level 1 Blinkblade ability: no level penalty applies.
        openAbilityByImage('blurry-jab');
        abilityModalButton('Enhance').click();
        cy.get('.ability-modal').contains('p', 'Cost: 50 Gold');

        cy.get('.ability-modal').contains('label', 'Ability property').find('select').select('lost');
        // 50 * 0.5 = 25
        cy.get('.ability-modal').contains('p', 'Cost: 25 Gold');

        cy.get('.ability-modal').contains('label', 'Ability property').find('select').select('persistent');
        // 50 * 3 = 150
        cy.get('.ability-modal').contains('p', 'Cost: 150 Gold');

        // Persistent doesn't triple summon stat enhancements: Summon Attack +1 stays 100
        cy.get('#enhancement-type').select('summon_attack');
        cy.get('.ability-modal').contains('p', 'Cost: 100 Gold');
    });

    it('It offers lost/persistent pricing for Mercenary Pack characters, whose cards use the Frosthaven design', () => {
        // Unlock Satha so she can be added to the (Gloomhaven) party.
        cy.visit('/tracker/#/party');
        utilities.scrollTo('100%', true);
        cy.get('#character-SA').click();

        cy.visit('/tracker/#/characters');
        utilities.openAbilities('Satha');
        cy.get('#desktop-enable-enhancements').check();

        // "blade of the north" is a level 1 Satha ability
        openAbilityByImage('blade-of-the-north');
        abilityModalButton('Enhance').click();
        cy.get('.ability-modal').contains('p', 'Cost: 50 Gold');

        cy.get('.ability-modal').contains('label', 'Ability property').find('select').select('lost');
        // 50 * 0.5 = 25
        cy.get('.ability-modal').contains('p', 'Cost: 25 Gold');
    });

    it('It prices X cards (level 1.5) like level 1 abilities', () => {
        cy.visit('/tracker/#/characters');
        utilities.openAbilities();
        cy.get('#desktop-enable-enhancements').check();

        // "heaving swing" is a Cragheart X card, stored as level 1.5.
        openAbilityByImage('heaving-swing');
        abilityModalButton('Enhance').click();

        // attack (50), no level penalty
        cy.get('.ability-modal').contains('p', 'Cost: 50 Gold');
    });

    it('It hides enhancement stickers on collapsed (stacked) cards but shows them on extended cards', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();
        cy.get('#enhancement-type').select('poison');
        abilityModalButton('Add').click();
        utilities.closeModel();

        // Scoped to the card grid: closing the modal via its X button leaves it mounted
        // (hidden behind a display:none ancestor) with its own separate sticker preview.
        cy.get('.ability-card .enhancement-sticker').should('exist').and('have.css', 'opacity', '1');

        cy.get('.available-header .material-icons').contains('content_copy').click();

        // The fadein transition fades it out; it may briefly remain in the DOM at opacity 0
        // before Vue removes it, so assert on the fade rather than strict (un)mounting.
        cy.get('.ability-card .enhancement-sticker').should(($stickers) => {
            expect($stickers.filter((_, el) => Cypress.$(el).css('opacity') !== '0')).to.have.length(0);
        });
    });

    it("It applies building #44 Enhancer's gold discounts to enhancement costs in Frosthaven", () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/characters');
        utilities.openAbilities('Blinkblade');

        cy.get('#desktop-enable-enhancements').check();
        cy.get('#desktop-show-all-abilities').check();

        // "double time" is a level 3 Blinkblade ability
        openAbilityByImage('double-time');
        abilityModalButton('Enhance').click();

        // No Enhancer built yet: attack (50 gold) + level penalty (2 * 25) = 100
        cy.get('.ability-modal').contains('p', 'Cost: 100 Gold');
        abilityModalButton('Add').click();

        cy.window().then((win) => {
            const enhancer = win.app.buildings.firstWhere('id', 44);
            enhancer.state = 'built';
            enhancer.level = 2;
        });

        abilityModalButton('Enhance').click();
        // Level 2: flat -10 discount. (50 + 2*25 + 1*75 repeat) - 10 = 165
        cy.get('.ability-modal').contains('p', 'Cost: 165 Gold');
        abilityModalButton('Cancel').click();

        cy.window().then((win) => {
            win.app.buildings.firstWhere('id', 44).level = 3;
        });

        abilityModalButton('Enhance').click();
        // Level 3: level penalty rate drops to 15/level. (50 + 2*15 + 1*75) - 10 = 145
        cy.get('.ability-modal').contains('p', 'Cost: 145 Gold');
        abilityModalButton('Cancel').click();

        cy.window().then((win) => {
            win.app.buildings.firstWhere('id', 44).level = 4;
        });

        abilityModalButton('Enhance').click();
        // Level 4: repeat penalty rate also drops to 50/repeat. (50 + 2*15 + 1*50) - 10 = 120
        cy.get('.ability-modal').contains('p', 'Cost: 120 Gold');
    });

    it('It persists the enhancements toggle and existing enhancements across a reload', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();
        cy.get('#enhancement-type').select('poison');
        abilityModalButton('Add').click();
        utilities.closeModel();

        cy.get('#desktop-enable-enhancements').uncheck();
        cy.reload();

        utilities.openAbilities('Cragheart', false);
        cy.get('#desktop-enable-enhancements').should('not.be.checked');
        cy.get('.ability-card .enhancement-sticker').should('not.exist');

        // Re-enabling reveals the enhancement was never lost, only hidden while disabled.
        cy.get('#desktop-enable-enhancements').check();
        cy.get('#available-avalanche').closest('.ability-card').click();
        cy.get('.ability-modal').contains('Poison');
    });

    it('It divides the attack_hex enhancement cost by the number of existing hexes', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();
        cy.get('#enhancement-type').select('attack_hex');

        // attack_hex base cost is 200, 1 hex (default): 200 / 1 = 200
        cy.get('.ability-modal').contains('p', 'Cost: 200 Gold');

        cy.get('input[aria-labelledby="enhancement-hex-count"]').clear({force: true}).type('4{enter}');
        // 200 / 4 = 50
        cy.get('.ability-modal').contains('p', 'Cost: 50 Gold');

        cy.get('input[aria-labelledby="enhancement-hex-count"]').clear({force: true}).type('3{enter}');
        // 200 / 3 = 66.67, rounded up to 67
        cy.get('.ability-modal').contains('p', 'Cost: 67 Gold');
    });

    it('It floors the enhancement cost at 0 gold instead of going negative', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/characters');
        utilities.openAbilities('Blinkblade');
        cy.get('#desktop-enable-enhancements').check();
        cy.get('#desktop-show-all-abilities').check();

        cy.window().then((win) => {
            const enhancer = win.app.buildings.firstWhere('id', 44);
            enhancer.state = 'built';
            enhancer.level = 2;
        });

        // "blurry jab" is a level 1 Blinkblade ability: no level penalty applies.
        openAbilityByImage('blurry-jab');
        abilityModalButton('Enhance').click();

        cy.get('#enhancement-type').select('attack_hex');
        cy.get('input[aria-labelledby="enhancement-hex-count"]').clear({force: true}).type('20{enter}');
        cy.get('.ability-modal').contains('label', 'Ability property').find('select').select('lost');

        // attack_hex: ceil(200/20) = 10, lost: *0.5 = 5, Enhancer L2 flat -10 = -5, floored to 0
        cy.get('.ability-modal').contains('p', 'Cost: 0 Gold');
    });

    it('It hides the multi-target checkbox and skips doubling the cost for exempt enhancement types', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();

        // "attack" is not exempt: the checkbox is offered.
        cy.get('#enhancement-multi-target').should('exist');

        // "target" is exempt (Appendix D already prices it for multiple targets): no checkbox, no doubling.
        cy.get('#enhancement-type').select('target');
        cy.get('#enhancement-multi-target').should('not.exist');
        cy.get('.ability-modal').contains('p', 'Cost: 50 Gold');
    });

    it('It shows the enhanced-card-limit warning only for a new card once the prosperity limit is reached', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();
        abilityModalButton('Add').click();
        utilities.closeModel();

        // A fresh campaign is prosperity level 1, so maxEnhancedCards === 1: the limit is
        // already reached by the card just enhanced.
        cy.get('#available-crater').closest('.ability-card').click();
        abilityModalButton('Enhance').click();
        cy.get('.ability-modal').contains('Enhanced card limit reached');
        utilities.closeModel();

        // Adding another enhancement to the already-enhanced card is still allowed.
        cy.get('#available-avalanche').closest('.ability-card').click();
        abilityModalButton('Enhance').click();
        cy.get('.ability-modal').contains('Enhanced card limit reached').should('not.exist');
    });

    it('It only lets you buy enhancements, with discounts, while the Enhancer is built and not wrecked', () => {
        const noEnhancer = 'Buying enhancements needs the Enhancer (building 44) built and not wrecked';

        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/characters');
        utilities.openAbilities('Blinkblade');
        cy.get('#desktop-enable-enhancements').check();
        cy.get('#desktop-show-all-abilities').check();

        // "double time" is a level 3 Blinkblade ability
        openAbilityByImage('double-time');
        abilityModalButton('Enhance').click();

        // Not built yet: can't buy, but the free "Add" stays available to record existing stickers.
        cy.get('.ability-modal').contains(noEnhancer);
        abilityModalButton('Buy').should('be.disabled');
        abilityModalButton('Add').should('not.be.disabled');
        abilityModalButton('Cancel').click();

        cy.window().then((win) => {
            const enhancer = win.app.buildings.firstWhere('id', 44);
            enhancer.state = 'wrecked';
            enhancer.level = 4;
        });

        abilityModalButton('Enhance').click();
        // Wrecked: can't buy, and no discounts. attack (50) + level penalty (2 * 25) = 100
        cy.get('.ability-modal').contains(noEnhancer);
        abilityModalButton('Buy').should('be.disabled');
        cy.get('.ability-modal').contains('p', 'Cost: 100 Gold');
        abilityModalButton('Cancel').click();

        cy.window().then((win) => {
            win.app.buildings.firstWhere('id', 44).state = 'damaged';
        });

        abilityModalButton('Enhance').click();
        // A damaged building stays in use: (50 + 2*15) - 10 = 70
        cy.get('.ability-modal').contains(noEnhancer).should('not.exist');
        cy.get('.ability-modal').contains('p', 'Cost: 70 Gold');
    });

    it('It blocks enhancement changes for read-only viewers', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();
        abilityModalButton('Add').click();
        utilities.closeModel();

        utilities.setReadOnly().then(() => {
            cy.get('#desktop-enable-enhancements').should('be.disabled');

            cy.get('#available-avalanche').closest('.ability-card').click();
            cy.get('.ability-modal .enhancement-sticker')
                .should('have.class', 'cursor-pointer')
                .and('not.have.class', 'cursor-move');
        });
    });

    it('It keeps enhancements when the character sheet view saves the sheet', () => {
        enableAndOpenAbility('available-avalanche');
        abilityModalButton('Enhance').click();
        cy.get('#enhancement-type').select('poison');
        abilityModalButton('Add').click();
        utilities.closeModel();

        // The character sheet view saves the sheet (here via "hide personal quests"); it must
        // not write an out-of-date copy of the sheet over the enhancement.
        cy.get('#desktop-character-menu a').first().click();
        utilities.scrollTo('100%', true);
        cy.get('#hide-personal-quests').check();
        cy.reload();

        utilities.openAbilities('Cragheart', false);
        cy.get('#desktop-enable-enhancements').should('be.checked');
        cy.get('.ability-card .enhancement-sticker').should('exist');
    });

    it('It deducts the cost from the character when buying, and only when they can afford it', () => {
        cy.visit('/tracker/#/characters');
        utilities.openCharacter();
        cy.get('input[aria-labelledby="gold"]').clear({force: true}).type('100{enter}');

        utilities.openAbilities('Cragheart', false);
        cy.get('#desktop-enable-enhancements').check();
        cy.get('#available-avalanche').closest('.ability-card').click();

        abilityModalButton('Enhance').click();
        cy.get('#enhancement-type').select('poison');
        abilityModalButton('Buy').click();
        cy.get('.ability-modal').contains('Poison');

        // 25 gold left, the repeat costs 150
        abilityModalButton('Enhance').click();
        cy.get('#enhancement-type').select('poison');
        cy.get('.ability-modal').contains('p', 'Cost: 150 Gold');
        abilityModalButton('Buy').should('be.disabled');
        abilityModalButton('Cancel').click();
        utilities.closeModel();

        cy.get('#desktop-character-menu a').first().click();
        cy.get('input[aria-labelledby="gold"]').should('have.value', '25');
    });

    it('It syncs the enhancements toggle and sticker moves to the cloud campaign', () => {
        const story = {id: 1, name: 'Synced', data: {}, expires_at: '2099-01-01'};
        let syncs = 0;
        cy.intercept('PUT', '**/stories/1', (req) => {
            syncs++;
            req.reply(story);
        });

        // Seed a cloud campaign (not shared, so nothing is fetched at boot) and reload into it.
        cy.visit('/tracker/#/characters');
        cy.window().then((win) => {
            win.localStorage.setItem('campaignId', JSON.stringify('_1'));
            win.localStorage.setItem('stories', JSON.stringify([story]));
        });
        cy.reload();
        utilities.openAbilities();

        const expectSync = (action) => {
            let before;
            cy.then(() => before = syncs);
            action();
            cy.wrap(null).should(() => expect(syncs).to.be.greaterThan(before));
        };

        expectSync(() => cy.get('#desktop-enable-enhancements').check());

        cy.get('#available-avalanche').closest('.ability-card').click();
        abilityModalButton('Enhance').click();
        expectSync(() => abilityModalButton('Add').click());

        // Dragging needs real pointer capture, so fire the sticker's drag and drop events directly.
        expectSync(() => cy.get('.ability-modal .enhancement-sticker').then(($sticker) => {
            const sticker = $sticker[0].__vue__;
            sticker.$emit('drag', sticker.id, 20, 30);
            sticker.$emit('reposition', sticker.id);
        }));
    });
});
