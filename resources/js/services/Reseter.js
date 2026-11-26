import store from "store/dist/store.modern";
import migrateDonationProsperity from "./app/migrateDonationProsperity";

export default class Reseter {
    reset(campaignId = 'local') {
        // The Gloomhaven edition settings are campaign choices, not progress
        const {edition, bothEditions} = store.get(campaignId)?.sheet || {};
        const sheet = _.pickBy({edition, bothEditions});
        store.remove(campaignId);
        app.campaignData = _.isEmpty(sheet) ? {} : {sheet};
        if (!_.isEmpty(sheet)) {
            // Marks the kept sheet, so donations made after the reset aren't migrated
            app.campaignData = migrateDonationProsperity(campaignId, app.campaignData);
        }

        app.fetchAchievements();
        app.fetchScenarios();
    }
}
