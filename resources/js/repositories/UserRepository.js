import store from "store/dist/store.modern";

export default class UserRepository {
    storeAccessToken(token, id) {
        let tokens = this.getTokens();
        tokens[id] = token;
        this.storeTokens(tokens);
    }

    async find(token) {
        if (!isNaN(token)) {
            token = this.getTokens()[token];
        }

        console.log({'Authorization': 'Bearer ' + token});

        const response = await axios.get('user', {
            headers: {'Authorization': 'Bearer ' + token}
        });
        const user = response.data;
        this.addUser(user);

        return user;
    }

    getTokens() {
        return store.get('tokens') || {};
    }

    storeTokens(tokens) {
        store.set('tokens', tokens);
    }

    getUsers() {
        return store.get('users') || {};
    }

    storeUsers(users) {
        store.set('users', users);
    }

    addUser(user) {
        let users = this.getUsers();
        users[user.id] = user;
        this.storeUsers(users);
    }

}
