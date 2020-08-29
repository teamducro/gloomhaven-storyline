import Storable from './Storable'

class Sheet {

    constructor(data = {}) {
        this.reputation = data.reputation;
        this.donations = data.donations;
        this.prosperityIndex = data.prosperityIndex;
        this.itemDesigns = data.itemDesigns;
        this.notes = data.notes;
        this.unlocks = data.unlocks;
        this.characters = data.characters;

        this.fieldsToStore = {
            reputation: 'reputation',
            donations: 'donations',
            prosperityIndex: 'prosperityIndex',
            itemDesigns: 'itemDesigns',
            notes: 'notes',
            unlocks: 'unlocks',
            characters: 'characters'
        };

        this.read();

        if (typeof this.reputation === 'undefined') {
            this.new();
        }
    }

    new() {
        this.reputation = 0;
        this.donations = 0;
        this.prosperityIndex = 1;
        this.itemDesigns = {
            71: false,
            72: false,
            73: false,
            74: false,
            75: false,
            76: false,
            77: false,
            78: false,
            79: false,
            80: false,
            81: false,
            82: false,
            83: false,
            84: false,
            85: false,
            86: false,
            87: false,
            88: false,
            89: false,
            90: false,
            91: false,
            92: false,
            93: false,
            94: false,
            95: false
        };
        this.notes = '';
        this.unlocks = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ];
        this.characters = [
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ];
    }

    key() {
        return 'sheet';
    }
}

Object.assign(Sheet.prototype, Storable);

export default Sheet;
