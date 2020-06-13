import AccessToken from "./AccessToken";

export default {
    inProduction() {
        return process.env.NODE_ENV === 'production';
    },
    loggedIn() {
        return typeof (new AccessToken).get() === 'string'
    }
}
