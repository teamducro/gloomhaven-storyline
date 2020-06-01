import utilities from "../utilities";

describe('Storage', () => {

    it('It stores data correctly in local storage', () => {
        cy.visit('/');
        utilities.completeScenario(1);

        utilities.store().then((store) => {
            expect(store.getItem('scenario-1')).eq('{"state":"complete","choice":null,"promptChoice":null,"notes":"","treasures":[]}');
            expect(store.getItem('achievementgroup-CR')).eq('{"achievements":["GCRM"]}');
            expect(store.getItem('achievement-GCRM')).eq('{"awarded":true,"count":1,"lost":false}');
            expect(store.getItem('achievement-PFS')).eq('{"awarded":true,"count":1,"lost":false}');
            expect(store.getItem('scenario-2')).eq('{"state":"incomplete","choice":null,"promptChoice":null,"notes":"","treasures":[]}');
        });
    });

});
