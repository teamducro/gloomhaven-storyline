import StoryRepository from "../repositories/StoryRepository";

export default {
    methods: {
        getCampaignName() {
            const story = (new StoryRepository).current();
            return story ? story.name : this.$t('local');
        }
    }
}
