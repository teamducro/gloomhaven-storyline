import StoryRepository from "../repositories/StoryRepository";
import ApiStoryRepository from "../apiRepositories/StoryRepository";

export default class StorySyncer {
    store() {
        const story = this.storyRepository.current();
        if (!story) {
            return;
        }

        story.data = app.campaignData;

        if (story.hasChanged()) {
            this.apiStoryRepository.update(story);
        }
    }

    fetch() {
        let story = this.storyRepository.current();
        if (!story) {
            return;
        }

        story = this.apiStoryRepository.find(story);
    }

    get storyRepository() {
        return this._storyRepository || (this._storyRepository = new StoryRepository);
    }

    get apiStoryRepository() {
        return this._apiStoryRepository || (this._apiStoryRepository = new ApiStoryRepository);
    }
}
