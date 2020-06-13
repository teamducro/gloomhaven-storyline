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

    storeStories(stories) {
        store.set('stories', stories);
    }

    getStories() {
        return collect(store.get('stories'))
            .map(story => new Story(story));
    }
}
