import componentMethods from "./componentMethods";
import LanguageSwitch from "../../components/elements/LanguageSwitch";
import {loadLanguageAsync} from "../I18n-setup";

export default function setInitialLanguage() {
    const languageSwitchComponent = componentMethods(LanguageSwitch);
    const initialLanguage = languageSwitchComponent.getInitialLanguage();
    if (initialLanguage !== window.i18n.fallbackLocale) {
        loadLanguageAsync(initialLanguage);
    }
}
