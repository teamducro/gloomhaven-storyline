import store from "store/dist/store.modern";

export default class Reseter {
    reset(campaignId = 'local') {
        // The Gloomhaven edition is a campaign choice, not progress
        const edition = store.get(campaignId)?.sheet?.edition;
        store.remove(campaignId);
        app.campaignData = edition ? {sheet: {edition}} : {};
        if (edition) {
            store.set(campaignId, app.campaignData);
        }

        app.fetchAchievements();
        app.fetchScenarios();
    }
}
