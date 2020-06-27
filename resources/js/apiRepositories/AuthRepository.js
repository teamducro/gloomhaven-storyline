import store from "store/dist/store.modern";
import ApiRepository from "./ApiRepository";

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
}
