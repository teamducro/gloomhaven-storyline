import ApiRepository from "./ApiRepository";
import StoryCode from "../apiModels/StoryCode";

export default class StoryRepository extends ApiRepository {
    async find(story) {
        const response = await this.api.post('story-code/' + story.id);
        const code = response.data.data;

        return new StoryCode(code);
    }
}
