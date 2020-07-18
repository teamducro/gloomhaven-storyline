import store from "store/dist/store.modern";
import ApiRepository from "./ApiRepository";
import Story from "../apiModels/Story";

export default class StoryRepository extends ApiRepository {
    async stories(token = null) {
        const response = await this.api.withToken(token).get('stories');
        const stories = response.data.data;
        this.storeStories(stories, token);

        collect(stories)
            .map(story => new Story(story))
            .each(story => {
                this.storeCampaignData(story);
            });

        return this.getStories();
    }

    async update(story) {
        const data = story.postData();
        return await this.api.withToken(story.token).put('stories/' + story.id, data)
            .then(response => {
                const storyResponse = response.data;
                this.storeStory(storyResponse, story.token);

                return new Story(storyResponse);
            });
    }

    async sharedStories() {
        const stories = this.getSharedStories();
        let promises = [];

        stories.each(story => {
            promises.push(this.find(story))
        });

        await Promise.all(promises);
    }

    async find(story) {
        const response = await this.api.withToken(story.token).get('stories/' + story.id);
        const storyResponse = response.data;
        this.storeStory(storyResponse, story.token);
        const s = new Story(storyResponse);
        this.storeCampaignData(s);

        return s;
    }

    replaceStory(story) {
        const oldStory = this.getStory(story.id);
        story.token = oldStory.token;
        story.is_shared = oldStory.is_shared;
        this.storeStory(story, oldStory.token);
        const s = new Story(story);
        this.storeCampaignData(s);
        return s;
    }

    storeStory(story, token) {
        this.storeStories([story], token);
    }

    storeStories(data, token) {
        const stories = collect(data);
        if (token) {
            stories.each(story => story.token = token);
        }
        const ids = stories.pluck('id').toArray();
        const otherStories = collect(store.get('stories', []))
            .filter(story => !ids.includes(story.id))
            .toArray();
        const storiesToStore = stories.merge(otherStories);
        store.set('stories', storiesToStore);
    }

    storeCampaignData(story) {
        store.set(story.campaignId, story.data);
    }

    getStories() {
        return collect(store.get('stories'))
            .map(story => new Story(story));
    }

    getStory(id) {
        return this.getStories().firstWhere('id', parseInt(id));
    }

    getSharedStories() {
        return this.getStories().filter((story) => story.is_shared);
    }
}
