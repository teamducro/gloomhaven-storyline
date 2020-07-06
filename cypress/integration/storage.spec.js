import utilities from "../utilities";

describe('Storage', () => {
    it('It stores data correctly in local storage', () => {
        let collect = require('collect.js');

        cy.visit('/');
        utilities.completeScenario(1);

        utilities.store().then((store) => {
            let campaignData = JSON.parse(store.getItem('local'));
            campaignData = collect(campaignData).map(x => JSON.stringify(x));

            expect(campaignData.get('scenario-1')).eq('{"state":"complete","choice":null,"promptChoice":null,"notes":"","treasures":[]}');
            expect(campaignData.get('achievementgroup-CR')).eq('{"achievements":["GCRM"]}');
            expect(campaignData.get('achievement-GCRM')).eq('{"awarded":true,"count":1,"lost":false}');
            expect(campaignData.get('achievement-PFS')).eq('{"awarded":true,"count":1,"lost":false}');
            expect(campaignData.get('scenario-2')).eq('{"state":"incomplete","choice":null,"promptChoice":null,"notes":"","treasures":[]}');
        });
    });

});
