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

    it('It opens item modal', () => {
        cy.visit('/tracker/#/items');

        cy.get('#items tbody tr:first').click();
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
        cy.visit('/tracker/#/shared/1/local/N4RozgjARAXKYBcQEsC+AacBOAbLeSamYAFsFAIYBOAxicgG4CmAJgMInUU0JNVj4MUOlx58AqgDsANgHsaAawFwoAIQBKsEBHRQ2ACS06oAZQDqR3QBUAkpdNt7AWStGMIEeQAsAIywsaLAAOLABaAHZAgCZQrywAMx9QnwAGAFYvUJYcJi8vRKjwih8fWDVNIRpkBABPfChoGG1dKPsAZnsvezT7PCbjcPsg+yx7CBSxxuaG1v7dCA65hq6liB7VvumIQdXh1dGlqInDqeMo2emoxcuVy-XLzbOdy73Lg+m24+13FhTMZBYwHcAAdkDoQFQ-lAqLIKCx6qcWu1Ot1evZnsZXsZ3sZxpMxhdcddcbdcfdcY95hj5lj5jiWl8zoioOd7Fc2aSWuSWpSWdSWbSWfSoJ83JgAK5A3QADzY0nFTGU5CmUIuUOuUNuUPuUM2UOeUNeUPeKVQlU4VG4vCosT8AWCYUiWBicUSyXSmWyuXyPkKxVKKjoTEUSqEAHNZNJ4TAoQCyhooLpqkwALZKhpiqDSJjMaSwYySCgppjxqji3iJqDAvhKerHADaIBSAF15rBGy2kTAO5hOyL203W1AVj3B7p1h2h31R32dpPdHsZ0ODvOGg3B0JxeK4zBh3bAiEItFYgkkqkMlkcnkCkUSpXpcDYKbUEA/items');

        cy.get('#items').contains('1 / 2');
        cy.get('#items tbody tr:first').click();
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

    it('It can add items to characters', () => {
        // Campaign with Brute without items
        cy.visit('/tracker/#/shared/1/local/N4Rozg5gFgtAjAIgFyjAFxASwL4BpzQwBMADEcqhjvpLKQMwXhV4F0kAsT6WrtxJAKzcWNQqQBsI3mPYB2adXAAzAMYwAnFJTMZIAIYQAwgCUm+sAG0EAcVMBZBAF1W+uycc79AdxBx8qgD2-iAANiAkfFDACPoATqpQmABuAKYAJkZQ8fqqaKlxYBR4CIk5eQUAqgB2oYGqANZFKAgAQmZIfrgIRgASyF0IAMoA6gP+CAAqAJLj3UNGcwj2k+OsZTGpGoJycNscMOkSWjAcqhKpMAAcEnBEmnKCJCQS+kTHqVxIbWYlqphoACeFAQiE6E3I4O6jChCC+g2EsO0gwUsKuSw0SzgJCxYMGdyxMPx8ImcER+ORpNR+PRsL2S1IDLxEMhgyIRIhJO6RHJEMp3OpENpbMxsPoOPBfzigTAYBs+gAtqlpvkFc0YtABiRugArQJoUJa7qqZoRKUyuWK5WqsAAUWq+gARqEMkaQOltVh0sBWAAHTAhOLahDS-TpEHM7lLDndLkIXndfkIQXdYUTUX4iX4yOg1mkmOguNkrFJuAp0Fp7r02GMms5oh57kFohxnkMpNEctESsIIgZibitb4ACuPr+2TiuXycRgWx2e0EByOJzOF2ut3uGkez1e7w0nxBTswoQBmFS6pKR5PQIACgUADKpNKGlqQ6rD0KhaHId+f2M-j8v3jAC-wQbRfyA1EINTECgNFCDx1SRoL26CBAlCcMkGDTBMJ+BBugBVI1WKboXWfZAJgdJVkDaOJh3yfCEF9AomhIhAAEdh3PNA2LiVI0EwPilWqNBmmDYdhxwmi512fZDmOCRTnOS4bjuB4nheN4Pi4boAA9fWQSJsCAA/items');

        cy.get('#items tbody tr:first').click();
        cy.get('.mdc-button').contains('add').click();

        utilities.closeModel();
        cy.visit('/tracker/#/characters');

        cy.get('#items-bedges').contains('Boots of Striding').should('exist');
    });

    it('It can remove items to characters', () => {
        // Campaign with Brute #001 Boots of Striding
        cy.visit('/tracker/#/shared/1/local/N4RozgjARAXKYBcQEsC+AacBOAbLeSamYAFsFAIYBOAxicgG4CmAJgMInUU0JNVj4MUOlx58AqgDsANgHsaAawFwoAIQBKsEBHRQ2ACS06oAZQDqR3QBUAkpdNt7AWStGMIEeQAsAIywsaLAAOLABaAHZAgCZQrywAMx9QnwAGAFYvUJYcJi8vRKjwih8fWDVNIRpkBABPfChoGG1dKPsAZnsvezT7PCbjcPsg+yx7CBSxxuaG1v7dCA65hq6liB7VvumIQdXh1dGlqInDqeMo2emoxcuVy-XLzbOdy73Lg+m24+13FhTMZBYwHcAAdkDoQFQ-lAqLIKCx6qcWu1Ot1evZnsZXsZ3sZxpMxhdcddcbdcfdcY95hj5lj5jiWl8zoioOd7Fc2aSWuSWpSWdSWbSWfSoJ83JgAK5A3QADzY0nFTGU5CmUIuUOuUNuUPuUM2UOeUNeUPeKVQlU4VG4vCosT8AWCYUiWBicUSyXSmWyuXyPkKxVKKjoTEUSqEAHNZNJ4TAoQCyhooLpqkwALZKhpiqDSJjMaSwYySCgppjxqji3iJqDAvhKerHADaIBSAF15rBGy2kTAO5hOyL203W1AVj3B7p1h2h31R32dpPdHsZ0ODvOGg3B0JxeK4zBh3bAiEItFYgkkqkMlkcnkCkUSpXpcDYKbUEA/items');

        cy.get('#items tbody tr:first').click();
        cy.get('.mdc-button').contains('remove').click();

        utilities.closeModel();
        cy.visit('/tracker/#/characters');

        cy.get('#items-bedges').contains('Boots of Striding').should('not.exist');
    });

    it('cant add items in read only mode', () => {
        // Campaign with Brute #001 Boots of Striding
        cy.visit('/tracker/#/shared/1/local/N4RozgjARAXKYBcQEsC+AacBOAbLeSamYAFsFAIYBOAxicgG4CmAJgMInUU0JNVj4MUOlx58AqgDsANgHsaAawFwoAIQBKsEBHRQ2ACS06oAZQDqR3QBUAkpdNt7AWStGMIEeQAsAIywsaLAAOLABaAHZAgCZQrywAMx9QnwAGAFYvUJYcJi8vRKjwih8fWDVNIRpkBABPfChoGG1dKPsAZnsvezT7PCbjcPsg+yx7CBSxxuaG1v7dCA65hq6liB7VvumIQdXh1dGlqInDqeMo2emoxcuVy-XLzbOdy73Lg+m24+13FhTMZBYwHcAAdkDoQFQ-lAqLIKCx6qcWu1Ot1evZnsZXsZ3sZxpMxhdcddcbdcfdcY95hj5lj5jiWl8zoioOd7Fc2aSWuSWpSWdSWbSWfSoJ83JgAK5A3QADzY0nFTGU5CmUIuUOuUNuUPuUM2UOeUNeUPeKVQlU4VG4vCosT8AWCYUiWBicUSyXSmWyuXyPkKxVKKjoTEUSqEAHNZNJ4TAoQCyhooLpqkwALZKhpiqDSJjMaSwYySCgppjxqji3iJqDAvhKerHADaIBSAF15rBGy2kTAO5hOyL203W1AVj3B7p1h2h31R32dpPdHsZ0ODvOGg3B0JxeK4zBh3bAiEItFYgkkqkMlkcnkCkUSpXpcDYKbUEA/items');

        utilities.setReadOnly().then(() => {
            cy.get('.items-to-add-dropdown').should('not.exist');
            cy.get('#items tbody tr:first').click();
            cy.get('.mdc-button').should('be.disabled');
        });
    });

    // TODO: it can buy items
    // TODO: it can sell items
});
