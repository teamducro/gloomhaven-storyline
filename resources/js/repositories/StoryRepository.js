export default class StoryRepository {
    current() {
        return this.find(app.campaignId);
    }

    find(id) {
        const campaignId = Number.isInteger(id) ? '_' + id : id;
        return app.stories.firstWhere('campaignId', campaignId);
    }
}
