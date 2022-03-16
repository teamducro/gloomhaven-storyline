import Vue from "vue";
import LanguageSwitch from "../../components/elements/LanguageSwitch";
import {loadLanguageAsync} from "../I18n-setup";

export default function setInitialLanguage() {
    const languageSwitchClass = Vue.extend(LanguageSwitch);
    const languageSwitchComponent = new languageSwitchClass;
    const initialLanguage = languageSwitchComponent.getInitialLanguage();
    if (initialLanguage !== window.i18n.fallbackLocale) {
        loadLanguageAsync(initialLanguage);
    }
}
