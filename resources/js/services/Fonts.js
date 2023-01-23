// import axios from 'axios';

const defaultFonts = ['Pirata One']; // default font

const supportedFonts = ['Pirata One', 'Nyala', 'sans-serif', 'Arial', 'Calibri'];

function setFont(font) {
    i18n.font = font;
    app.$i18n.font = font;
    // axios.defaults.headers.common['Accept-Language'] = lang;
    // document.querySelector('html').setAttribute('lang', lang);
    console.log(`Updated font to: ${font}`);
    return font;
}

export function loadFontAsync(font) {
    // If the language isn't supported
    if (supportedFonts.indexOf(font) < 0) {
        return Promise.resolve(setFont(i18n.fallbackFont));
    }

    // If the same language
    if (i18n.font === font) {
        return Promise.resolve(setFont(font));
    }

    // If the language was already loaded
    if (supportedFonts.includes(font)) {
        return Promise.resolve(setFont(font));
    }

    console.log('SHOULD NOT REACH HERE');
    // If the language hasn't been loaded yet
    // return import(/* webpackChunkName: "lang-[request]" */ `../lang/${lang}/${lang}.js`).then(
    //     messages => {
    //         i18n.setLocaleMessage(lang, messages.default);
    //         loadedLanguages.push(lang);
    //         return setFont(lang);
    //     }
    // )
}
