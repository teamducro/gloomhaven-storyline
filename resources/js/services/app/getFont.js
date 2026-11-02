import componentMethods from "./componentMethods";
import FontSelected from "../../components/elements/FontSwitch.vue";

export default function getFont() {
    const fontSelectedComponent = componentMethods(FontSelected);
    return fontSelectedComponent.getFont();
}
