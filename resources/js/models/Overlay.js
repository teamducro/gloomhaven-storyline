import Storable from './Storable';
import UsesTranslations from "./UsesTranslations";

class Overlay {

    constructor(data) {
        this.id = data.id;
        this._name = data.name;
        this.present = data.present || false;
        this.coordinates = data.coordinates || {};
        this.linkedFrom = collect(data.linked_from || []);
        this.game = data.game;
        this.translationKey = `overlays.${this.game}-${this.id}`;

        this.fieldsToStore = {
            "name": "_name", // Because the name of the Boat is customisable
            "present": "present",
        };

        this.read();
    }

    set name(name) {
        // Only allow the Boat to have its name changed
        if (this.game == 'fh' && this.id == 'A' && this._name !== name) {
            this._name = name;
            this.store();
        }
    }

    get name() {
        // Return the stored name for the Boat, and the translation for everything else
        if (this.game == 'fh' && this.id == 'A') {
            return this._name;
        }
        return this.$tPrefix('name');
    }

    image() {
        return '/img/overlays/' + this.game + '/' + this.id + '.png';
    }

    key() {
        return 'overlay-' + this.game + '-' + this.id;
    }
}

Object.assign(Overlay.prototype, Storable);
Object.assign(Overlay.prototype, UsesTranslations);

export default Overlay;
