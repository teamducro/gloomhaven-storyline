import store from "store/dist/store.modern";
import {loadLanguageAsync} from "../I18n-setup";

export const languages = {
    'en': 'English',
    'fr': 'Français',
    'it': 'Italiano',
    'de': 'Deutsch',
    'es': 'Español',
    'pl': 'Polski',
    'ru': 'Pусский',
    'hu': 'Magyar',
    'pt': 'Português',
    'br': 'Português (Brasil)',
    'cs': 'Čeština',
    'ko': '한국어',
    'th': 'ไทย',
    'zh': '简体中文',
    'tw': '繁體中文',
};

export function getInitialLanguage() {
    let lang = store.get('lang');

    // 'pt' used to be Brazilian Portuguese, before European Portuguese was added.
    if (!store.get('ptSplit')) {
        store.set('ptSplit', true);
        if (lang === 'pt') {
            lang = 'br';
            store.set('lang', lang);
        }
    }

    if (!lang) {
        const locale = browserLanguage(navigator.language);
        if (languages.hasOwnProperty(locale)) {
            lang = locale;
            store.set('lang', lang);
        }
    }

    return lang;
}

export default function setInitialLanguage() {
    const initialLanguage = getInitialLanguage();
    if (initialLanguage !== window.i18n.fallbackLocale) {
        loadLanguageAsync(initialLanguage);
    }
}

function browserLanguage(locale) {
    if (locale === 'pt-BR') {
        return 'br';
    }
    if (/^zh-(TW|HK|MO|Hant)/.test(locale)) {
        return 'tw';
    }
    return locale.substring(0, 2);
}
