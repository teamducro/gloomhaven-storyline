import StoryRepository from "../repositories/StoryRepository";
import ApiStoryRepository from "../apiRepositories/StoryRepository";
import dayjs from "dayjs";
import Sheet from "../models/Sheet";
import Character from "../models/Character";
import CampaignSheet from "../models/CampaignSheet";
import {Game} from "../models/Game";

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
        const modelMap = {
            'sheet': Sheet,
            'campaign': CampaignSheet,
            'character': Character
        };

        for (const key in data) {
            // Remove undefined values
            if (key.endsWith('-undefined') || key === 'character-demo') {
                delete data[key];
                continue;
            }

            for (const modelName in modelMap) {
                if (key.startsWith(modelName)) {
                    const modelData = data[key];

                    // Add game to the sheet data to prevent issues while updating the version.
                    if (modelName === 'sheet' || modelName === 'campaign') {
                        modelData.game = key.includes('-') ? key.split('-')[1] : Game.gh;
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
