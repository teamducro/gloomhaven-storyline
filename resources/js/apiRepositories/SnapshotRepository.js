import ApiRepository from "./ApiRepository";
import StoryRepository from "./StoryRepository";
import Story from "../apiModels/Story";
import Snapshot from "../apiModels/Snapshot";

export default class SnapshotRepository extends ApiRepository {
    async take(story) {
        const snapshotResponse = await this.api.post('/stories/' + story.id + '/take-snapshot');
        story.snapshots.prepend(new Snapshot(snapshotResponse.data.data));

        return story;
    }

    async restore(story, snapshot) {
        const storyResponse = await this.api.post('/stories/' + story.id + '/restore-snapshot/' + snapshot.id);

        this.storyRepository.storeStory(storyResponse.data);

        const s = new Story(storyResponse.data);
        this.storyRepository.storeCampaignData(s);

        return s;
    }

    get storyRepository() {
        return this._storyRepository || (this._storyRepository = new StoryRepository());
    }
}
