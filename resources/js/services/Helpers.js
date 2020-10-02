import AccessToken from "./AccessToken";

export default {
    inProduction() {
        return process.env.NODE_ENV === 'production';
    },
    loggedIn() {
        return typeof (new AccessToken).get() === 'string'
    },
    isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    },
    removeQueryString() {
        history.replaceState({}, document.title, location.href.replace(location.search, ''));
    },
    isMac() {
        return window.navigator.platform.match("Mac");
    }
}
