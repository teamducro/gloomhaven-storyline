import store from "store/dist/store.modern";
import ApiRepository from "./ApiRepository";
import User from "../apiModels/User";

export default class UserRepository extends ApiRepository {
    async find() {
        const response = await this.api.get('user');
        const user = response.data.data;
        this.storeUser(user);

        return new User(user);
    }

    async update(user) {
        const response = await this.api.put('user', user.postData());
        user = response.data.data;
        this.storeUser(user);

        return new User(user);
    }

    storeUser(user) {
        store.set('user', user);
    }

    getUser() {
        const user = store.get('user')
        if (user) {
            return new User(user);
        }
    }
}
