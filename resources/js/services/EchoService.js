import AuthRepository from "../apiRepositories/AuthRepository";
import Echo from "laravel-echo";

export default class EchoService {

    constructor() {
        this.listens = [];
    }

    init() {
        let auth = new AuthRepository();
        window.Pusher = require('pusher-js');
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
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
        if (!window.Echo) {
            this.init();
        }

        if (!this.listens.includes(story.id)) {
            window.Echo.private(`story.${story.id}`)
                .listen('StoryUpdated', event => {
                    console.log(event.story);
                    callback(event.story);
                });

            this.listens.push(story.id);
        }
    }
}
