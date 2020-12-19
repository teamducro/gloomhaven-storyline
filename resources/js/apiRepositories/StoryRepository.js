import store from "store/dist/store.modern";
import ApiRepository from "./ApiRepository";
import Story from "../apiModels/Story";
import moment from "moment";

export default class StoryRepository extends ApiRepository {
    async stories(token = null) {
        const response = await this.api.withToken(token).get('stories');
        const storyResponses = collect(response.data.data);
        let promises = [];

        storyResponses.each(async (response) => {
            promises.push(this.updateStoryIfNeeded(response, token));
        });

        await Promise.all(promises);

        return this.getStories();
    }

    async update(story) {
        const data = story.postData();

        window.app.$bus.$emit('toast', 'Saving progress...');

        return await this.api.withToken(story.token)
            .put('stories/' + story.id, data)
            .then(response => {
                window.app.$bus.$emit('toast', 'Progress saved!');

                let storyResponse = response.data;
                if (story.token) {
                    storyResponse.token = story.token;
                }
                this.storeStory(storyResponse);

                return new Story(storyResponse);
            })
            .catch(reason => {
                window.app.$bus.$emit('toast', 'Failed to save progress, try again later.', false);
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
        return await this.updateStoryIfNeeded(response.data, story.token);
    }

    // If local campaign is newer then remote campaign, update it
    async updateStoryIfNeeded(response, token = null) {
        let remoteStory = new Story(response);
        const localStory = this.getStory(remoteStory.id);

        if (localStory
            && localStory.updated_at > moment().subtract(1, 'weeks')
            && localStory.updated_at > remoteStory.updated_at) {
            remoteStory = await this.update(localStory);
        } else {
            this.storeStory(response, token);
        }
        this.storeCampaignData(remoteStory);

        return remoteStory;
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

    remove(story) {
        const otherStories = collect(store.get('stories', []))
            .filter(s => s.id !== story.id)
            .toArray();
        store.set('stories', otherStories);
        store.remove(story.campaignId);
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
