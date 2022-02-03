import store from "store/dist/store.modern";
import utilities from "../utilities";

describe('Achievements', () => {

    it('It opens achievements page', () => {
        cy.visit('/tracker/#/achievements');

        cy.contains('Global Achievements');
        cy.contains('Party Achievements');
    });

    it('It gains achievements when completing a scenario', () => {
        cy.visit('/tracker');
        utilities.isNodeVisible(1);
        utilities.isNodeHidden(2);

        utilities.achievements().then((achievements) => {
            const a = achievements.firstWhere('id', 'PFS');
            expect(a.awarded).false;
        });

        utilities.completeScenario(1);

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PFS');
            expect(a.awarded).true;
        });

        utilities.isNodeVisible(2);
    });

    it('It loses achievements when a scenario is undone', () => {
        cy.visit('/tracker');
        utilities.completeScenario(1);

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PFS');
            expect(a.awarded).true;
        });

        utilities.incompleteScenario(1);

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PFS');
            expect(a.awarded).false;
        });
    });

    it('It could lose an achievement when completing a scenario', () => {
        cy.visit('/tracker/?groups=CR_GCRM&states=1_c-2_c-3_c-4_i-7_c-8_c-9_b-13_i-14_c-16_c-18_i-20_c-24_c-25_i-28_r-30_c-32_c-33_i-40_r-42_i');

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PTVC');
            expect(a.awarded).true;
        });

        utilities.completeScenario(42);

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PTVC');
            expect(a.awarded).false;
        });
    });

    it('It regains a lost achievement when a scenario is undone', () => {
        cy.visit('/tracker/?groups=CR_GCRM&states=1_c-2_c-3_c-4_i-7_c-8_c-9_b-13_i-14_c-16_c-18_i-20_c-24_c-25_i-28_r-30_c-32_c-33_i-40_r-42_c');

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PTVC');
            expect(a.awarded).false;
        });

        utilities.incompleteScenario(42);

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PTVC');
            expect(a.awarded).true;
        });
    });

    it('It gains a manual achievement when unlocking a scenario required by one', () => {
        cy.visit('/tracker');

        utilities.incompleteScenario(74);

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PHSE');
            expect(a.awarded).true;
        });
    });

    it('It loses a manual achievement when locking a scenario required by one', () => {
        cy.visit('/tracker/?groups=CR_GCRM&states=74_i');

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PHSE');
            expect(a.awarded).true;
        });

        utilities.lockSideScenario(74);

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PHSE');
            expect(a.awarded).false;
        });
    });

    it('It can search for manual achievements', () => {
        cy.visit('/tracker/#/achievements');

        cy.get('button').contains('add').click();
        cy.get('input[name=achievement-to-add]').type('hi');
        cy.get('li').contains('High Sea Escort').click();
        cy.get('#party-achievements li').contains('High Sea Escort').should('be.visible');

        // And it unlocks the required scenario
        cy.visit('/tracker/#/story');
        utilities.isNodeIncomplete(74);
    });

    it('It can remove manual achievements', () => {
        cy.visit('/tracker/?groups=CR_GCRM&states=74_i');
        cy.visit('/tracker/#/achievements');

        cy.get('#party-achievements li').contains('High Sea Escort').click();
        cy.get('button').contains('Remove').click();

        utilities.achievements().then((achievements) => {
            let a = achievements.firstWhere('id', 'PHSE');
            expect(a.awarded).false;
        });

        // And it locks the required scenario
        cy.visit('/tracker/#/story');
        utilities.isSideNodeHidden(74);
    });

    it('It can gain an achievement multiple times', () => {
        cy.visit('/tracker/#/shared/1/local/N4Rozg5gFgtAjAIgFyjAFxAYwL4BpwBmmMAnAGzKoYCWe4UwCAhgE6ZTUBuApgCYDCUVk0xpuLMJTwJ2w0eICqAOwA2Ae0wBrSSgQAhAErIQcXAn4AJY6YQBlAOrWzAFQCSTu-w8BZZ9bqywNKY1GgAnpQIiEgmZgBMHgDMHgAsHgCsHhQxNgDsHgAcHiQecAAMpdGxUQk5ZnDJdVFpTXCZrdnVcPmtRa0lTXEVg1U2cbXVcY2TLZPtk51jPZN9kwPVicMmdNS8QfgADtQ2LGpMvJGj8UmpGVkeyzarNus25ZWlE2-Tb7Nv829FvVHvVnvVXvEtmMrghxh4pvC-vEAfEgbCQbCwbCIQhNv58ABXIJ0JgABQAYrZKCAmAB3WJYNSmEAqEBlOiQWC1KhYEkQfhGFA0sAAbQQAHEBd4EABdEmSgzSoV0hmYJn4Vns-CcmCNHkAIw50BgLR5OG1xvaPNoFtg2TNJNJAClSdSVcy1czNY6ACJ6N30j3qllso2wPoO-BMcXObzkgOq4Pe20wHqR8DGhrU9AgG0Z2BwU3gDDmmkx0kAUQTQa9oZTQ2zJbD8GGPKgzbgAzbjtsXmV9LK+DVg5DWvzMDiaeLIHbUZjBgAcgmR8ONXXx3B7dO8zq4BHp6WdXF9zmd8a4kWc7Px3ErSADphmVfmwihTnD+et+-myk9Qf5QAgn4-aJrWI4ALZMOuZLOIKoDukOSbQRSfbwYGiFgS+3L-lGEAAQYwHwaKEr4QgZjigBXhynOpEgSuagjqycDNok0TpjqiR3ugCAsNwACOBLULxFwsV+aA8fxgnCQggGoTS6GMphKaJFO37KSeTbKV2OFlvY-ogTWa5jjBPpySq9GMeuHF-g+T4YNeHGXvZjrOAAaoR8lsohlnGaSzg+h55neUZ8r+QB1YYSFUZ+c4gUKZ6UXjikqmaWWFYAPJmfFaiJIlOrpGx26OgY4UGZFo4-k5uY-hpvLRUBPoRYpeWZlxNA-mJdVpZl2EIc1FVzhl-B-n1CUVdgQA/achievements');
        cy.get('#global-achievements li').contains('End of Corruption (3)').click();

        cy.get('.mdc-dialog__title').contains('End of Corruption (3)');
    })
});
