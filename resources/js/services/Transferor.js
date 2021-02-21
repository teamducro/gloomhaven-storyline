import store from "store/dist/store.modern";
import StoryRepository from "../apiRepositories/StoryRepository";

export default class Transferor {
    async transfer(story) {
        // copy to synced campaign
        if (story) {
            story.data = app.campaignData;
            story = await this.storyRepository.update(story);
            this.storyRepository.storeCampaignData(story);
        }
        // copy to local campaign
        else {
            store.set('local', app.campaignData);
        }
    }

    get storyRepository() {
        return this._storyRepository || (this._storyRepository = new StoryRepository);
    }
}
