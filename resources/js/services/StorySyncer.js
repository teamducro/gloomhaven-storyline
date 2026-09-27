import StoryRepository from "../repositories/StoryRepository";
import ApiStoryRepository from "../apiRepositories/StoryRepository";
import dayjs from "dayjs";
import store from "store/dist/store.modern";
import Sheet from "../models/Sheet";
import Character from "../models/Character";
import CampaignSheet from "../models/CampaignSheet";
import Scenario from "../models/Scenario";
import Achievement from "../models/Achievement";
import Building from "../models/Building";
import Overlay from "../models/Overlay";
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
            'character': Character,
            'scenario': Scenario,
            'achievement': Achievement,
            'building': Building,
            'overlay': Overlay,
        };
        let bumped = false;

        for (const key in data) {
            // Remove undefined values
            if (key.endsWith('-undefined') || key === 'character-demo') {
                delete data[key];
                continue;
            }

            // A tombstoned (deleted) key: keep the null as-is, don't try to reconstruct a model from it.
            if (data[key] === null) {
                continue;
            }

            for (const modelName in modelMap) {
                if (key === modelName || key.startsWith(modelName + '-')) {
                    // Copy to avoid leaking the id/game recovered below into app.campaignData
                    const modelData = {...data[key]};

                    // Add game to the sheet data to prevent issues while updating the version.
                    if (modelName === 'sheet' || modelName === 'campaign') {
                        modelData.game = key.includes('-') ? key.split('-')[1] : Game.gh;
                    }

                    // Scenario/Building/Overlay/Achievement don't store id/game; recover them from the key so key() resolves correctly.
                    if (['scenario', 'building', 'overlay'].includes(modelName)) {
                        const parts = key.split('-');
                        modelData.game = parts[1];
                        modelData.id = parts.slice(2).join('-');
                    } else if (modelName === 'achievement') {
                        modelData.id = key.split('-').slice(1).join('-');
                    }

                    // Resolve an instance of the model
                    let model = new modelMap[modelName](modelData);

                    // If model is versionable, increase the version if it has changed.
                    if (typeof model.hasChanged === "function" && model.hasChanged()) {
                        model.increaseVersion();
                        app.campaignData[key] = model.valuesToStore();
                        bumped = true;
                    }

                    // Make sure only values to store are kept
                    data[key] = model.valuesToStore();
                }
            }
        }

        // Persist all version bumps in one write instead of one per model
        if (bumped) {
            store.set(app.campaignId, app.campaignData);
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
