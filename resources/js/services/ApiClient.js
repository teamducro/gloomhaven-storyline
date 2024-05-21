import store from "store/dist/store.modern";
import Csrf from "./Csrf";

export default class ApiClient {

    constructor() {
        this.useToken = true;
        this.token = null;
        this.csrf = new Csrf;
    }

    async request(method, url, options, data = {}) {
        options = await this.applyHeaders(options);

        try {
            let response;
            if (['get', 'delete', 'head'].includes(method)) {
                response = await window.axios[method](url, options);
            } else {
                response = await window.axios[method](url, data, options);
            }

            this.withToken();

            return response;
        } catch (e) {
            throw e;
        }
    }

    async get(url, options) {
        return this.request('get', url, options);
    }

    async post(url, data, options) {
        return this.request('post', url, options, data);
    }

    async put(url, data, options) {
        return this.request('put', url, options, data);
    }

    async head(url, options) {
        return this.request('head', url, options);
    }

    async applyHeaders(options = {}) {
        if (!options.hasOwnProperty('headers')) {
            options.headers = {};
        }

        if (!options.headers.hasOwnProperty('Accept')) {
            options.headers.Accept = 'application/json';
        }

        if (this.useToken) {
            const token = this.getBearerToken();
            if (!options.headers.hasOwnProperty('Authorization') && token) {
                options.headers.Authorization = 'Bearer ' + token;
            }
        } else {
            await this.csrf.init();
        }

        return options;
    }

    getBearerToken() {
        if (this.token) {
            return this.token;
        }

        return store.get('token');
    }

    withToken(token) {
        this.useToken = true;
        this.token = token;

        return this;
    }

    withoutToken() {
        this.useToken = false;

        return this;
    }

}
