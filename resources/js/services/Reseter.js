import store from "store/dist/store.modern";

export default class Reseter {
    reset(campaignId = 'local') {
        store.remove(campaignId);
        app.campaignData = {};

        app.fetchAchievements();
        app.fetchScenarios();
    }
}
