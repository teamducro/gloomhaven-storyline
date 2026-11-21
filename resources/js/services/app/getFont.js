import store from "store/dist/store.modern";

const titleFont = 'Pirata One';

export function readFontSettings() {
    const settings = store.get('font');
    if (typeof settings === 'object') {
        return settings;
    }

    const defaults = {current: 'Nyala', headers: false, storyline: false};
    store.set('font', defaults);

    return defaults;
}

export function applyFont(settings) {
    const stylesheet = [...document.styleSheets].find(sheet => sheet.href?.includes('/css/app.css'));

    const cssSelectors = ['html, body', '.font-title', '.font-default', 'div[class*="mdc-"]', 'h1, h2, h3', '#storyline text'];
    const cssSelectorsWithFonts = Object.fromEntries(cssSelectors.map(selector => [selector, settings.current]));

    if (!settings.headers) {
        cssSelectorsWithFonts['h1, h2, h3'] = titleFont;
        cssSelectorsWithFonts['.font-title'] = titleFont;
    }

    if (!settings.storyline) {
        cssSelectorsWithFonts['#storyline text'] = titleFont;
    }

    for (let [selector, font] of Object.entries(cssSelectorsWithFonts)) {
        const cssRule = [...stylesheet.cssRules].find((r) => r.selectorText === selector)
        if (cssRule) {
            cssRule.style.setProperty('font-family', font, 'important');
        }
    }
}

export default function getFont() {
    const settings = readFontSettings();
    applyFont(settings);

    return settings;
}
