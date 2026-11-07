import utilities from "../utilities";

describe('Items', () => {

    it('It checks item designs', () => {
        cy.visit('/tracker/#/items');

        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-75').click();
        utilities.closeModel();
        cy.get('#items').contains('Circlet of Elements');

        // Make sure it also works after a reload!
        cy.reload(true);
        cy.get('#items').contains('Circlet of Elements');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-71').click();
        utilities.closeModel();
        cy.get('#items').contains('Boots of Levitation');

        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-75').click();
        utilities.closeModel();
        cy.get('#items').contains('Circlet of Elements').should('not.exist');
    });

    it('It can search items by name', () => {
        cy.visit('/tracker/#/items');

        utilities.assertTableCount('items', 14);

        cy.get('[name="item-search"]').type('boots');
        utilities.assertTableCount('items', 1);
    });

    it('It can search items by id', () => {
        cy.visit('/tracker/#/items');

        utilities.assertTableCount('items', 14);

        cy.get('[name="item-search"]').type('3');
        utilities.assertTableCount('items', 2);
    });

    it('It can search items by desc', () => {
        cy.visit('/tracker/#/items');

        utilities.assertTableCount('items', 14);

        cy.get('[name="item-search"]').type('move');
        utilities.assertTableCount('items', 2);
    });

    it('It can filter items', () => {
        cy.visit('/tracker/#/items');

        utilities.assertTableCount('items', 14);

        cy.get('[alt="body"]').click();
        utilities.assertTableCount('items', 3);

        cy.get('[alt="head"]').click();
        utilities.assertTableCount('items', 2);

        cy.get('[alt="small-item"]').click();
        utilities.assertTableCount('items', 3);
    });

    it('It shows where items come from and filters on it', () => {
        // Given a prosperity 1 shop with item design 71 ticked
        cy.visit('/tracker/#/items');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-71').click();
        utilities.closeModel();
        utilities.assertTableCount('items', 15);

        // Then the design is labelled, shop items are not
        cy.get('#items tbody tr').contains('Boots of Levitation').parents('tr').contains('Item design');
        cy.get('#items').contains('Boots of Striding').parents('tr').should('not.contain', 'Item design').and('not.contain', 'Shop');

        // And the item modal shows the design label
        cy.get('#items').contains('Boots of Levitation').click({ scrollBehavior: 'center' });
        cy.get('.mdc-dialog').contains('Item design');
        utilities.closeModel();

        // When filtering on item designs
        cy.get('#item-source-filters').contains('Item design').click();
        utilities.assertTableCount('items', 1);
        cy.get('#items').contains('Boots of Levitation');

        // When filtering on the shop
        cy.get('#item-source-filters').contains('Shop').click();
        utilities.assertTableCount('items', 14);

        // When filtering on other games
        cy.get('#item-source-filters').contains('Other game').click();
        cy.get('#items').contains('No items available');

        // When the active filter is clicked again
        cy.get('#item-source-filters').contains('Other game').click();
        utilities.assertTableCount('items', 15);
    });

    it('It labels items from other games', () => {
        cy.visit('/tracker/#/items');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#cross-game-items-enabled-checkbox').click();
        cy.get('#jotl-items').click();
        cy.get('.items-to-add-dropdown button').first().click();

        cy.get('#item-source-filters').contains('Other game').click();
        cy.get('#items').contains('Jet Boots').parents('tr').contains('Other game');

        cy.get('#item-source-filters').contains('Shop').click();
        utilities.assertTableCount('items', 14);
    });

    it('It labels Frosthaven shop items and item designs', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/items');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-67').click();
        utilities.closeModel();

        cy.get('#items').contains('Converging Lenses').parents('tr').contains('Item design');
        cy.get('#item-source-filters').contains('Item design').click();
        utilities.assertTableCount('items', 1);
    });

    it('It opens item modal', () => {
        cy.visit('/tracker/#/items');

        cy.get('#items tbody tr:first').click({ scrollBehavior: 'center' });
        cy.get('.mdc-dialog').contains('Prosperity 1');
    });

    it('It unlocks items from treasures', () => {
        cy.visit('/tracker?states=1_c-2_c-4_c');

        // Unlock treasure
        utilities.openScenario(4);
        cy.get('#treasure-38').parent().click();

        // The item is clickable
        cy.get('a').contains('Ring of Skulls').click();
        cy.get('h2').contains('#123');
        utilities.closeModel();

        // The item is unlocked
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Ring of Skulls');

        // Lock treasure
        cy.visit('/tracker/#/story');
        utilities.openScenario(4);
        cy.get('#treasure-38').parent().click();
        cy.get('a').contains('Ring of Skulls').should('not.exist');
        utilities.closeModel();

        // The item should still be unlocked
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Ring of Skulls');
    });

    it('It unlocks items from rewards', () => {
        cy.visit('/tracker?states=52_c');

        // Complete scenario
        utilities.openScenario(53);
        cy.get('#scenario-content label').contains('Complete').click();

        // The item is clickable
        cy.get('a').contains('Staff of Xorn').click();
        cy.get('h2').contains('#114');
        utilities.closeModel();
        utilities.closeModel();

        // The item is unlocked
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Staff of Xorn');

        // Incomplete scenario
        cy.visit('/tracker/#/story');
        utilities.openScenario(53);
        cy.get('#scenario-content label').contains('Incomplete').click();
        cy.get('a').contains('Staff of Xorn').should('not.exist');
        utilities.closeModel();

        // The item should still be unlocked
        cy.visit('/tracker/#/items');
        cy.get('#items').contains('Staff of Xorn');
    });

    it('It opens scenario modal from item modal', () => {
        cy.visit('/tracker?states=52_c-53_c');
        cy.visit('/tracker/#/items');
        utilities.scrollTo('100%', true);
        cy.get('#items tbody tr:last').click();
        cy.get('.mdc-dialog__content button').contains(53).click();
        cy.get('.mdc-dialog__content span').contains('Reward from').should('not.exist');
        cy.get('#scenario-title h2').contains('#53 Crypt Basement');
    });

    it('It shows item availability', () => {
        // Campaign with Brute #001 Boots of Striding
        utilities.visitShared('/tracker/#/shared/1/local/N4RozgjARAXKYBcQEsC+AacBOAbLeSamYAFsFAIYBOAxicgG4CmAJgMInUU0JNVj4MUOlx58AqgDsANgHsaAawFwoAIQBKsEBHRQ2ACS06oAZQDqR3QBUAkpdNt7AWStGMIEeQAsAIywsaLAAOLABaAHZAgCZQrywAMx9QnwAGAFYvUJYcJi8vRKjwih8fWDVNIRpkBABPfChoGG1dKPsAZnsvezT7PCbjcPsg+yx7CBSxxuaG1v7dCA65hq6liB7VvumIQdXh1dGlqInDqeMo2emoxcuVy-XLzbOdy73Lg+m24+13FhTMZBYwHcAAdkDoQFQ-lAqLIKCx6qcWu1Ot1evZnsZXsZ3sZxpMxhdcddcbdcfdcY95hj5lj5jiWl8zoioOd7Fc2aSWuSWpSWdSWbSWfSoJ83JgAK5A3QADzY0nFTGU5CmUIuUOuUNuUPuUM2UOeUNeUPeKVQlU4VG4vCosT8AWCYUiWBicUSyXSmWyuXyPkKxVKKjoTEUSqEAHNZNJ4TAoQCyhooLpqkwALZKhpiqDSJjMaSwYySCgppjxqji3iJqDAvhKerHADaIBSAF15rBGy2kTAO5hOyL203W1AVj3B7p1h2h31R32dpPdHsZ0ODvOGg3B0JxeK4zBh3bAiEItFYgkkqkMlkcnkCkUSpXpcDYKbUEA/items');

        cy.get('#items').contains('1 / 2');
        cy.get('#items tbody tr:first').click({ scrollBehavior: 'center' });
        cy.get('.mdc-dialog').contains('Availability: 1 / 2');
    });

    it('It can use items from other games', () => {
        cy.visit('/tracker/#/items');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#cross-game-items-enabled-checkbox').click();
        cy.get('#jotl-items').click();

        utilities.scrollTo('100%', true);
        cy.get('#items').contains('Jet Boots').should('exist');

        // Make sure it also works after a reload!
        cy.reload(true);
        utilities.scrollTo('100%', true);
        cy.get('#items').contains('Jet Boots').should('exist');
    });

    it('It can use items from other games in FH', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/items');
        cy.get('.items-to-add-dropdown button').click();
        utilities.scrollTo('50%');
        cy.get('#cross-game-items-enabled-checkbox').click();
        cy.get('#gh25').click();

        utilities.scrollTo('100%', true);
        cy.get('#items').contains('Jagged Sword').should('exist');

        // Make sure it also works after a reload!
        cy.reload(true);
        utilities.scrollTo('100%', true);
        cy.get('#items').contains('Jagged Sword').should('exist');
    });

    it('It can flip a flip item\'s card in the item modal', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');

        cy.visit('/tracker/#/items');
        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-67').click();
        utilities.closeModel();

        cy.get('#items').contains('Converging Lenses').click();
        cy.get('.mdc-dialog').contains('h2', '#067');

        // Starts on the front, flipping via the button shows the back.
        cy.get('.mdc-dialog .flip-card .inner').should('not.have.class', 'flipped');
        cy.get('.mdc-dialog').contains('button', 'flip').click();
        cy.get('.mdc-dialog .flip-card .inner').should('have.class', 'flipped');

        // The whole card image is clickable too, and flips back to the front.
        cy.get('.mdc-dialog .flip-card').parent().click();
        cy.get('.mdc-dialog .flip-card .inner').should('not.have.class', 'flipped');
    });

    it('It can add items to characters', () => {
        // Campaign with Brute without items
        utilities.visitShared('/tracker/#/shared/1/local/N4Rozg5gFgtAjAIgFyjAFxASwL4BpzQwBMADEcqhjvpLKQMwXhV4F0kAsT6WrtxJAKzcWNQqQBsI3mPYB2adXAAzAMYwAnFJTMZIAIYQAwgCUm+sAG0EAcVMBZBAF1W+uycc79AdxBx8qgD2-iAANiAkfFDACPoATqpQmABuAKYAJkZQ8fqqaKlxYBR4CIk5eQUAqgB2oYGqANZFKAgAQmZIfrgIRgASyF0IAMoA6gP+CAAqAJLj3UNGcwj2k+OsZTGpGoJycNscMOkSWjAcqhKpMAAcEnBEmnKCJCQS+kTHqVxIbWYlqphoACeFAQiE6E3I4O6jChCC+g2EsO0gwUsKuSw0SzgJCxYMGdyxMPx8ImcER+ORpNR+PRsL2S1IDLxEMhgyIRIhJO6RHJEMp3OpENpbMxsPoOPBfzigTAYBs+gAtqlpvkFc0YtABiRugArQJoUJa7qqZoRKUyuWK5WqsAAUWq+gARqEMkaQOltVh0sBWAAHTAhOLahDS-TpEHM7lLDndLkIXndfkIQXdYUTUX4iX4yOg1mkmOguNkrFJuAp0Fp7r02GMms5oh57kFohxnkMpNEctESsIIgZibitb4ACuPr+2TiuXycRgWx2e0EByOJzOF2ut3uGkez1e7w0nxBTswoQBmFS6pKR5PQIACgUADKpNKGlqQ6rD0KhaHId+f2M-j8v3jAC-wQbRfyA1EINTECgNFCDx1SRoL26CBAlCcMkGDTBMJ+BBugBVI1WKboXWfZAJgdJVkDaOJh3yfCEF9AomhIhAAEdh3PNA2LiVI0EwPilWqNBmmDYdhxwmi512fZDmOCRTnOS4bjuB4nheN4Pi4boAA9fWQSJsCAA/items');

        cy.get('#items tbody tr:first').click({ scrollBehavior: 'center' });
        cy.get('.mdc-button').contains('add').click();

        utilities.closeModel();
        cy.visit('/tracker/#/characters');

        cy.get('#items-bedges').contains('Boots of Striding').should('exist');
    });

    it('It can remove items to characters', () => {
        // Campaign with Brute #001 Boots of Striding
        utilities.visitShared('/tracker/#/shared/1/local/N4RozgjARAXKYBcQEsC+AacBOAbLeSamYAFsFAIYBOAxicgG4CmAJgMInUU0JNVj4MUOlx58AqgDsANgHsaAawFwoAIQBKsEBHRQ2ACS06oAZQDqR3QBUAkpdNt7AWStGMIEeQAsAIywsaLAAOLABaAHZAgCZQrywAMx9QnwAGAFYvUJYcJi8vRKjwih8fWDVNIRpkBABPfChoGG1dKPsAZnsvezT7PCbjcPsg+yx7CBSxxuaG1v7dCA65hq6liB7VvumIQdXh1dGlqInDqeMo2emoxcuVy-XLzbOdy73Lg+m24+13FhTMZBYwHcAAdkDoQFQ-lAqLIKCx6qcWu1Ot1evZnsZXsZ3sZxpMxhdcddcbdcfdcY95hj5lj5jiWl8zoioOd7Fc2aSWuSWpSWdSWbSWfSoJ83JgAK5A3QADzY0nFTGU5CmUIuUOuUNuUPuUM2UOeUNeUPeKVQlU4VG4vCosT8AWCYUiWBicUSyXSmWyuXyPkKxVKKjoTEUSqEAHNZNJ4TAoQCyhooLpqkwALZKhpiqDSJjMaSwYySCgppjxqji3iJqDAvhKerHADaIBSAF15rBGy2kTAO5hOyL203W1AVj3B7p1h2h31R32dpPdHsZ0ODvOGg3B0JxeK4zBh3bAiEItFYgkkqkMlkcnkCkUSpXpcDYKbUEA/items');

        cy.get('#items tbody tr:first').click({ scrollBehavior: 'center' });
        cy.get('.mdc-button').contains('remove').click();

        utilities.closeModel();
        cy.visit('/tracker/#/characters');

        cy.get('#items-bedges').contains('Boots of Striding').should('not.exist');
    });

    it('cant add items in read only mode', () => {
        // Campaign with Brute #001 Boots of Striding
        utilities.visitShared('/tracker/#/shared/1/local/N4RozgjARAXKYBcQEsC+AacBOAbLeSamYAFsFAIYBOAxicgG4CmAJgMInUU0JNVj4MUOlx58AqgDsANgHsaAawFwoAIQBKsEBHRQ2ACS06oAZQDqR3QBUAkpdNt7AWStGMIEeQAsAIywsaLAAOLABaAHZAgCZQrywAMx9QnwAGAFYvUJYcJi8vRKjwih8fWDVNIRpkBABPfChoGG1dKPsAZnsvezT7PCbjcPsg+yx7CBSxxuaG1v7dCA65hq6liB7VvumIQdXh1dGlqInDqeMo2emoxcuVy-XLzbOdy73Lg+m24+13FhTMZBYwHcAAdkDoQFQ-lAqLIKCx6qcWu1Ot1evZnsZXsZ3sZxpMxhdcddcbdcfdcY95hj5lj5jiWl8zoioOd7Fc2aSWuSWpSWdSWbSWfSoJ83JgAK5A3QADzY0nFTGU5CmUIuUOuUNuUPuUM2UOeUNeUPeKVQlU4VG4vCosT8AWCYUiWBicUSyXSmWyuXyPkKxVKKjoTEUSqEAHNZNJ4TAoQCyhooLpqkwALZKhpiqDSJjMaSwYySCgppjxqji3iJqDAvhKerHADaIBSAF15rBGy2kTAO5hOyL203W1AVj3B7p1h2h31R32dpPdHsZ0ODvOGg3B0JxeK4zBh3bAiEItFYgkkqkMlkcnkCkUSpXpcDYKbUEA/items');

        // Wait until the shared campaign is imported, otherwise the import resets the read only story.
        cy.location('hash').should('eq', '#/items');
        cy.get('#items tbody tr:first').should('contain', '1 / 2');

        utilities.setReadOnly().then(() => {
            cy.get('.items-to-add-dropdown').should('not.exist');
            cy.get('#items tbody tr:first').click({ scrollBehavior: 'center' });
            cy.get('.mdc-button').should('be.disabled');
        });
    });

    // TODO: it can buy items
    // TODO: it can sell items

    it('It has the corrected Frosthaven item data', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/items');

        cy.window().then((win) => {
            const item = (id) => win.app.items.firstWhere('id', 'fh-' + id);
            expect(item(225)._slot).eq('One Hand');
            expect(item(224)._source).eq('Scenario 60');
            expect(item(39)._source).contains('Personal Quest 19');
        });
    });

    it('It rewards Armor of Empathy for FH scenario 60', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/story');

        utilities.scenarios().then((scenarios) => {
            expect(scenarios.firstWhere('id', 60).rewardItems().values().all().map(Number)).to.include(224);
        });
    });

    it('It can mark the Abyss Axe design in Frosthaven', () => {
        utilities.enableGame('fh');
        utilities.switchGame('fh');
        cy.visit('/tracker/#/items');

        cy.get('.items-to-add-dropdown button').click();
        cy.get('#item-39').click();
        utilities.closeModel();
        cy.get('#items').contains('Abyss Axe');
    });
});
