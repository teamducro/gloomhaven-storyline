// import axios from 'axios';

const loadedLanguages = ['en']; // our default language that is preloaded
const supportedLanguages = ['en', 'de', 'fr'];

function setI18nLanguage(lang) {
    i18n.locale = lang;
    // axios.defaults.headers.common['Accept-Language'] = lang;
    document.querySelector('html').setAttribute('lang', lang);
    return lang;
}

export function loadLanguageAsync(lang) {
    // If the language isn't supported
    if (supportedLanguages.indexOf(lang) < 0) {
        return Promise.resolve(setI18nLanguage(i18n.fallbackLocale));
    }

    // If the same language
    if (i18n.locale === lang) {
        return Promise.resolve(setI18nLanguage(lang));
    }

    // If the language was already loaded
    if (loadedLanguages.includes(lang)) {
        return Promise.resolve(setI18nLanguage(lang));
    }

    // If the language hasn't been loaded yet
    return import(/* webpackChunkName: "lang-[request]" */ `../lang/${lang}.js`).then(
        messages => {
            i18n.setLocaleMessage(lang, messages.default);
            loadedLanguages.push(lang);
            return setI18nLanguage(lang);
        }
    )
}
