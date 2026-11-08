import store from "store/dist/store.modern";
import migrateDonationProsperity from "./app/migrateDonationProsperity";

export default class Reseter {
    reset(campaignId = 'local') {
        // The Gloomhaven edition is a campaign choice, not progress
        const edition = store.get(campaignId)?.sheet?.edition;
        store.remove(campaignId);
        app.campaignData = edition ? {sheet: {edition}} : {};
        if (edition) {
            // Marks the kept sheet, so donations made after the reset aren't migrated
            app.campaignData = migrateDonationProsperity(campaignId, app.campaignData);
        }

        app.fetchAchievements();
        app.fetchScenarios();
    }
}
