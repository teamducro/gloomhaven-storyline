import Helpers from "../services/Helpers";

class ModifierCard {

    constructor(data) {
        this._code = data.code;
        this.type = data.type;
        this.effects = data.effects || [];
        this.rolling = data.rolling || false;
        this.count = data.count || 0;
        this.path = data.path.toLowerCase(); // p1 / br / etc
    }

    get code() {
        if (this._code) {
            return this._code;
        }

        let code = this.type;
        this.effects.forEach(effect => {
            if (['element', 'condition'].includes(effect.type)) {
                code += '_' + effect.value;
            } else {
                code += '_' + effect.type + effect.value;
            }
        })

        if (this.rolling) {
            code += '_rolling';
        }

        return code;
    }

    get image() {
        return '/img/attack-modifiers/' + this.path + '/' + this.code + '.jpg';
    }
}

export default ModifierCard;
