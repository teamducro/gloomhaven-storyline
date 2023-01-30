import Vue from "vue";
import FontSwitch from "../../components/elements/FontSwitch";
import {loadFontAsync} from "../Fonts";

export default function setInitialFont() {
    const fontSwitchClass = Vue.extend(FontSwitch);
    const fontSwitchComponent = new fontSwitchClass;
    if (store.get('font') == null || store.get('font') == undefined) {
        fontSwitchComponent.setInitialFont();
    }
}
