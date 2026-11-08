// import axios from 'axios';
import reloadForNewBuild from "./app/reloadForNewBuild";

const loadedLanguages = ['en']; // our default language that is preloaded
// The backend stores 2-letter codes: 'br' is Brazilian Portuguese (not Breton), 'zh'/'tw' Simplified/Traditional Chinese.
const htmlLanguages = {br: 'pt-BR', zh: 'zh-Hans', tw: 'zh-Hant'};
const supportedLanguages = ['en', 'fr', 'it', 'de', 'es', 'pl', 'ru', 'hu', 'pt', 'br', 'cs', 'ko', 'th', 'zh', 'tw'];

function setI18nLanguage(lang) {
    i18n.locale = lang;
    app.$i18n.locale = lang;
    // axios.defaults.headers.common['Accept-Language'] = lang;
    document.querySelector('html').setAttribute('lang', htmlLanguages[lang] ?? lang);
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
    return import(/* webpackChunkName: "lang-[request]" */ `../lang/${lang}/${lang}.js`).then(
        messages => {
            i18n.setLocaleMessage(lang, messages.default);
            loadedLanguages.push(lang);
            return setI18nLanguage(lang);
        }
    ).catch(() => {
        reloadForNewBuild();
        return i18n.locale;
    })
}
