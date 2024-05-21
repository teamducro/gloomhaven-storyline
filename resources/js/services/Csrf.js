export default class Csrf {
    async init() {
        return axios.get(process.env.MIX_API_URL+'/sanctum/csrf-cookie');
    }
}
