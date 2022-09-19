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

        for (const key in data) {
            for (const modelName in modelMap) {
                if (key.startsWith(modelName)) {
                    const modelData = data[key];

                    // Add game to the sheet data to prevent issues while updating the version.
                    if (modelName === 'sheet') {
                        modelData.game = key.includes('-') ? key.split('-')[1] : 'gh';
                    }

                    // Resolve an instance of the model
                    let model = new modelMap[modelName](modelData);

                    // If model is versionable, increase the version if it has changed.
                    if (typeof model.hasChanged === "function" && model.hasChanged()) {
                        model.increaseVersion();
                    }

                    // Make sure only values to store are kept
                    data[key] = model.valuesToStore();
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
