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

    it('It applies multi-target and ability-property multipliers plus the ability-level penalty to the cost', () => {
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
        cy.get('#enhancement-multi-target').uncheck();

        cy.get('.ability-modal').contains('label', 'Ability property').find('select').select('lost');
        // (50 * 0.5) + 25 level penalty = 50
        cy.get('.ability-modal').contains('p', 'Cost: 50 Gold');

        cy.get('.ability-modal').contains('label', 'Ability property').find('select').select('persistent');
        // (50 * 3) + 25 level penalty = 175
        cy.get('.ability-modal').contains('p', 'Cost: 175 Gold');
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
});
