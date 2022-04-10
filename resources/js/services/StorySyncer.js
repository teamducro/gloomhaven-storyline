import StoryRepository from "../repositories/StoryRepository";
import ApiStoryRepository from "../apiRepositories/StoryRepository";
import dayjs from "dayjs";
import Sheet from "../models/Sheet";
import Character from "../models/Character";

export default class StorySyncer {
    store(force = false) {
        const story = this.storyRepository.current();
        if (!story) {
            return;
        }

        story.data = this.getStoryData();
        const hasChanged = story.hasChanged();

        if (hasChanged) {
            story.hash = story.makeHash();
            story.updated_at = dayjs();
            this.apiStoryRepository.storeStory(story);
        }

        if (hasChanged || force) {
            this.apiStoryRepository.update(story);
        }
    }

    getStoryData() {
        // clone data to prevent references
        const data = _.clone(app.campaignData);
        const modelMap = {'sheet': Sheet, 'character': Character};

        // Remove unneeded data
        delete data['character-demo'];

        // Make sure only values to store are kept
        for (const key in data) {
            for (const model in modelMap) {
                if (key.startsWith(model)) {
                    data[key] = new modelMap[model](data[key]).valuesToStore();
                }
            }
        }

        // Data to store
        return data;
    }

    get storyRepository() {
        return this._storyRepository || (this._storyRepository = new StoryRepository);
    }

    get apiStoryRepository() {
        return this._apiStoryRepository || (this._apiStoryRepository = new ApiStoryRepository);
    }
}
