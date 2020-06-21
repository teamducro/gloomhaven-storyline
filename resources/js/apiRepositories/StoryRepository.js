import store from "store/dist/store.modern";
import ApiRepository from "./ApiRepository";
import Story from "../apiModels/Story";

export default class StoryRepository extends ApiRepository {
    async stories(token = null) {
        const response = await this.api.withToken(token).get('stories');
        const stories = response.data.data;
        this.storeStories(stories);

        return collect(stories)
            .map(story => new Story(story))
            .each(story => {
                this.storeCampaignData(story);
            });
    }

    async update(story) {
        const data = story.postData();
        return await this.api.put('stories/' + story.id, data);
    }

    async find(story) {
        const response = await this.api.withToken(story.token).get('stories/' + story.id);
        const s = response.data.data;
        this.storeStory(s, story.token);

        return new Story(s);
    }

    storeStories(data) {
        const stories = collect(data);
        const ids = stories.pluck('id').toArray();
        const otherStories = collect(store.get('stories', []))
            .filter(story => !ids.includes(story.id));
        const storiesToStore = stories.merge(otherStories).toArray();
        store.set('stories', storiesToStore);
    }

    storeStory(story, token) {
        if (token) {
            story.token = token;
        }
        this.storeStories([story]);
    }

    storeCampaignData(story) {
        store.set(story.campaignId, story.data);
    }

    getStories() {
        return collect(store.get('stories'))
            .map(story => new Story(story));
    }
}
