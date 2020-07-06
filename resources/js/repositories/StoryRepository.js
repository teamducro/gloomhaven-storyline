export default class StoryRepository {
    current() {
        return this.find(app.campaignId);
    }

    find(id) {
        return app.stories.firstWhere('campaignId', id);
    }
}
