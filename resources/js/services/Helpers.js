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
    nl2br(string) {
        if (typeof string === 'undefined' || string === null) {
            return '';
        }

        return (string + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br/>$2');
    },
    removeQueryString() {
        history.replaceState({}, document.title, location.href.replace(location.search, ''));
    },
    isMac() {
        return window.navigator.platform.match("Mac");
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
