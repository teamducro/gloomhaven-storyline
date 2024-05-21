export default class Csrf {
    async init() {
        return axios.get('/sanctum/csrf-cookie');
    }
}
