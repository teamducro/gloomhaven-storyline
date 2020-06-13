import store from "store/dist/store.modern";

export default class AccessToken {
    store(token) {
        store.set('token', token);
    }

    get() {
        return store.get('token');
    }
}
