import store from "store/dist/store.modern";
import utilities from "../utilities";

describe('Achievements', () => {

    it('It opens achievements page', () => {
        cy.visit('/tracker/#/achievements');

        cy.get('#app').within(() => {
            cy.contains('Global Achievements');
            cy.contains('Party Achievements');
        });
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
});
