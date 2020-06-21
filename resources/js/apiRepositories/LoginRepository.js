import store from "store/dist/store.modern";
import ApiRepository from "./ApiRepository";
import User from "../apiModels/User";
import Csrf from "../services/Csrf";

export default class LoginRepository extends ApiRepository {
    async login() {
        const url = location.hash.substr(1);
        return this.api.withoutToken().get(url);
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
