import Vue from "vue";
import FontSwitch from "../../components/elements/FontSwitch";
import {loadFontAsync} from "../Fonts";

export default function setInitialFont() {
    const fontSwitchClass = Vue.extend(FontSwitch);
    const fontSwitchComponent = new fontSwitchClass;
    const initialFont = fontSwitchComponent.getInitialFont();
    if (initialFont !== window.i18n.fallbackLocale) {
        loadFontAsync(initialFont);
    }
}
