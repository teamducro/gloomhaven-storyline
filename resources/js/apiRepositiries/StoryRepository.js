import store from "store/dist/store.modern";
import ApiRepository from "./ApiRepository";
import Story from "../apiModels/Story";

export default class StoryRepository extends ApiRepository {
    async stories() {
        const response = await this.api.get('stories');
        const stories = response.data.data;
        this.storeStories(stories);

        return collect(stories)
            .map(story => new Story(story));
    }

    async update(story) {
        const data = story.postData();
        return await this.api.put('stories/' + story.id, data);
    }

    async find(story) {
        const response = await this.api.get('stories/' + story.id);
        const s = response.data.data;
        this.storeStory(s);

        return new Story(s);
    }

    storeStories(stories) {
        store.set('stories', stories);
    }

    storeStory(story) {
        let stories = collect(store.get('stories', []));
        stories = stories.filter(s => s.id = story.id);
        stories.push(story);
        this.storeStories(stories);
    }

    getStories() {
        return collect(store.get('stories'))
            .map(story => new Story(story));
    }
}
