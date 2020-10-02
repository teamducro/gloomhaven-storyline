import StoryRepository from "../repositories/StoryRepository";
import ApiStoryRepository from "../apiRepositories/StoryRepository";
import moment from "moment";

export default class StorySyncer {
    store(force = false) {
        const story = this.storyRepository.current();
        if (!story) {
            return;
        }

        story.data = app.campaignData;
        const hasChanged = story.hasChanged();

        if (hasChanged) {
            story.updated_at = moment();
            this.apiStoryRepository.storeStory(story);
        }

        if (hasChanged || force) {
            this.apiStoryRepository.update(story);
        }
    }

    get storyRepository() {
        return this._storyRepository || (this._storyRepository = new StoryRepository);
    }

    get apiStoryRepository() {
        return this._apiStoryRepository || (this._apiStoryRepository = new ApiStoryRepository);
    }
}
