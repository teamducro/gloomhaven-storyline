import ApiRepository from "./ApiRepository";
import StoryCode from "../apiModels/StoryCode";

export default class StoryRepository extends ApiRepository {
    async find(story) {
        const response = await this.api.post('story-code/' + story.id);
        const code = response.data.data;

        return new StoryCode(code);
    }
    async update(story, readOnly = false) {
        const response = await this.api.put('story-code/' + story.id, {
            read_only: readOnly,
        });
        const code = response.data.data;

        return new StoryCode(code);
    }
}
