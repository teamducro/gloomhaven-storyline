import slugify from "slugify";
import UsesTranslations from "./UsesTranslations";
import Character from "./Character";

class Item {

    constructor(data) {
        this.id = data.id;
        this._name = data.name;
        this.level = data.level ?? null;
        this.initiative = data.initiative ?? null;
        this.character_id = data.character_id;
        this.variations = data.variations ?? [];
        this.reference = data.reference ?? false;
        this.game = data.game;
        this.translationKey = `abilities.${this.game}-${this.code}`;
    }

    get name() {
        return this.$tPrefix('name');
    }

    get code() {
        return slugify(this._name.replaceAll("'", ''), {lower: true});
    }

    get image() {
        return `/img/abilities/${this.game}/${this.character_id}/${this.code}.jpg`;
    }

    get variation_images() {
        return this.variations.map(variation => `/img/abilities/${this.game}/${this.character_id}/${variation}-${this.code}.jpg`);
    }

    get back() {
        return `/img/abilities/${this.game}/${this.character_id}/${this.character_id}-back.png`;
    }
}

Object.assign(Item.prototype, UsesTranslations);

export default Item;
