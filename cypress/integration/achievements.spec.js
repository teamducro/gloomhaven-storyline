import store from "store/dist/store.modern";
import utilities from "../utilities";

describe('Storyline', () => {

    it('It gains achievements when completing a scenario', () => {
        cy.visit('/');
        utilities.isNodeVisible(1);
        utilities.isNodeHidden(2);

        utilities.achievements().then((achievements) => {
            let fs = achievements.firstWhere('id', 'PFS');
            expect(fs.awarded).false;
        });

        utilities.completeScenario(1);

        utilities.achievements().then((achievements) => {
            let fs = achievements.firstWhere('id', 'PFS');
            expect(fs.awarded).true;
        });

        utilities.isNodeVisible(2);
    });

    it('It loses achievements when a scenario is undone', () => {
        cy.visit('/');
        utilities.completeScenario(1);

        utilities.achievements().then((achievements) => {
            let fs = achievements.firstWhere('id', 'PFS');
            expect(fs.awarded).true;
        });

        utilities.incompleteScenario(1);

        utilities.achievements().then((achievements) => {
            let fs = achievements.firstWhere('id', 'PFS');
            expect(fs.awarded).false;
        });
    });

    it('It could lose an achievement when completing a scenario', () => {
        cy.visit('/?groups=CR_GCRM&states=1_c-2_c-3_c-4_i-7_c-8_c-9_b-13_i-14_c-16_c-18_i-20_c-24_c-25_i-28_r-30_c-32_c-33_i-40_r-42_i');

        utilities.achievements().then((achievements) => {
            let fs = achievements.firstWhere('id', 'PTVC');
            expect(fs.awarded).true;
        });

        utilities.completeScenario(42);

        utilities.achievements().then((achievements) => {
            let fs = achievements.firstWhere('id', 'PTVC');
            expect(fs.awarded).false;
        });
    });

    it('It regains a lost achievement when a scenario is undone', () => {
        cy.visit('/?groups=CR_GCRM&states=1_c-2_c-3_c-4_i-7_c-8_c-9_b-13_i-14_c-16_c-18_i-20_c-24_c-25_i-28_r-30_c-32_c-33_i-40_r-42_c');

        utilities.achievements().then((achievements) => {
            let fs = achievements.firstWhere('id', 'PTVC');
            expect(fs.awarded).false;
        });

        utilities.incompleteScenario(42);

        utilities.achievements().then((achievements) => {
            let fs = achievements.firstWhere('id', 'PTVC');
            expect(fs.awarded).true;
        });
    });
});
