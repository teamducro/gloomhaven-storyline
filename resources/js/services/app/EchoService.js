import AuthRepository from "../../apiRepositories/AuthRepository";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import StoryRepository, {unsynced} from "../../apiRepositories/StoryRepository";
import {flushSync} from "../StorySyncer";

export default class EchoService {

    constructor() {
        this.listens = [];
    }

    init() {
        let auth = new AuthRepository();
        window.Pusher = Pusher;
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.MIX_PUSHER_KEY,
            cluster: import.meta.env.MIX_PUSHER_APP_CLUSTER,
            encrypted: true,
            authorizer: (channel, options) => {
                return {
                    authorize: (socketId, callback) => {
                        auth.broadcast(socketId, channel.name)
                            .then(response => {
                                callback(false, response.data);
                            })
                            .catch(error => {
                                callback(true, error);
                            });
                    }
                };
            },
        });
    }

    listen(story, callback) {
        if (story.has_expired) {
            return;
        }

        if (!window.Echo) {
            this.init();
        }

        if (!this.listens.includes(story.id)) {
            // A burst of updates (several devices saving) causes one refetch.
            const handle = _.debounce(async (event) => {
                // Push a local edit first, so the server copy holds it; keep a failed one instead of overwriting it.
                const hadEdit = unsynced.has(story.id);
                await flushSync();
                if (unsynced.has(story.id)) {
                    return;
                }

                // The event's story predates an edit just pushed.
                const newStory = (!hadEdit && event.story) || await this.refetch(story);
                if (newStory) {
                    callback(newStory);
                }
            }, 1000);
            window.Echo.private(`story.${story.id}`).listen('StoryUpdated', handle);

            this.listens.push(story.id);
        }
    }

    // The next load refetches anyway; only a rate limit is worth one more try.
    async refetch(story, retry = true) {
        try {
            return await this.storyRepository.findWithoutUpdates(story);
        } catch (e) {
            if (retry && e.response?.status === 429) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                return this.refetch(story, false);
            }
            return null;
        }
    }

    get storyRepository() {
        return this._storyRepository || (this._storyRepository = new StoryRepository());
    }
}
