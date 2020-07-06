import store from "store/dist/store.modern";
import ApiRepository from "./ApiRepository";
import ScenarioRepository from "../repositories/ScenarioRepository";
import StoryRepository from "./StoryRepository";
import Helpers from "../services/Helpers";

export default class AuthRepository extends ApiRepository {
    async login() {
        const url = location.hash.substr(1);
        return this.api.withoutToken().get(url);
    }

    logout() {
        store.remove('stories');
        store.remove('user');
        store.remove('token');
    }

    async mailLoginToken(email) {
        return this.api.withoutToken()
            .post('mail-login-link', {
                'email': email
            });
    }

    async submitShareCode(code) {
        return this.api.withoutToken()
            .post('/login/story-code', {
                'code': code,
                'device_name': navigator.userAgent
            });
    }

    broadcast(socketId, channelName) {
        let storyId = channelName.split('.').pop();

        if (Helpers.isNumeric(storyId)) {
            const story = this.storyRepository.getStory(storyId);
            if (story && story.is_shared) {
                this.api.withToken(story.token);
            }
        }

        return this.api.post('/broadcasting/auth', {
            socket_id: socketId,
            channel_name: channelName
        });
    }

    get storyRepository() {
        return this._storyRepository || (this._storyRepository = new StoryRepository);
    }
}
