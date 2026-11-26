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

// Sets the font variables the stylesheet uses; its rules can't be read (not loaded yet, or cross-origin).
export function applyFont(settings) {
    // Unquoted, so the generic 'sans-serif' option stays generic.
    const font = settings.current;
    const style = document.documentElement.style;
    style.setProperty('--font-default', `${font}, sans-serif`);
    style.setProperty('--font-title', settings.headers ? `${font}, sans-serif` : `'${titleFont}', Nyala, sans-serif`);
    style.setProperty('--font-storyline', settings.storyline ? font : `'${titleFont}'`);
}

export default function getFont() {
    const settings = readFontSettings();
    applyFont(settings);

    return settings;
}
