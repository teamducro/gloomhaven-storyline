import Helpers from "../services/Helpers";

class ModifierCard {

    constructor(data) {
        this.code = data.code;
        this.icon = data.icon;
        this.path = data.path;
    }

    get image() {
        let path = Helpers.start(this.path, '/').replace(/\/+$/, "")
        return path + '/' + this.code + '.jpg';
    }
}

export default ModifierCard;
