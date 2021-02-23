import Storable from './Storable'

class Sheet {

    constructor(data = {}) {
        this.reputation = data.reputation;
        this.donations = data.donations;
        this.prosperityIndex = data.prosperityIndex;
        this.itemDesigns = {...data.itemDesigns};
        this.city = {...data.city};
        this.road = {...data.road};
        this.notes = data.notes;
        this.unlocks = {...data.unlocks};
        this.characters = {...data.characters};

        this.fieldsToStore = {
            reputation: 'reputation',
            donations: 'donations',
            prosperityIndex: 'prosperityIndex',
            itemDesigns: {'itemDesigns': {}},
            city: {'city': {}},
            road: {'road': {}},
            notes: 'notes',
            unlocks: {'unlocks': {}},
            characters: {'characters': {}}
        };

        this.read();

        if (typeof app.campaignData[this.key()] === 'undefined') {
            this.new();
        }
    }

    new() {
        this.reputation = 0;
        this.donations = 0;
        this.prosperityIndex = 1;
        this.itemDesigns = {};
        this.city = {};
        this.road = {};
        this.notes = '';
        this.unlocks = {};
        this.characters = {
            0: true,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
        };
        for (let i = 1; i <= 30; i++) {
            this.city[i] = true;
            this.road[i] = true;
        }
        this.fillBlanks();
    }

    fillBlanks() {
        for (let i = 71; i <= 150; i++) {
            this.itemDesigns[i] = this.itemDesigns[i] || false;
        }

        for (let i = 1; i <= 90; i++) {
            this.city[i] = this.city[i] || false;
        }

        for (let i = 1; i <= 69; i++) {
            this.road[i] = this.road[i] || false;
        }

        // FC
        this.road[82] = this.road[82] || false;
        this.road[83] = this.road[83] || false;

        for (let i = 0; i < 8; i++) {
            this.unlocks[i] = this.unlocks[i] || false;
        }

        for (let i = 0; i < 18; i++) {
            this.characters[i] = this.characters[i] || false;
        }
    }

    read() {
        this.parentRead();
        this.fillBlanks();
    }

    valuesToStore() {
        let values = this.parentValuesToStore();
        values.itemDesigns = collect({...this.itemDesigns}).filter(v => v).all();
        values.city = collect({...this.city}).filter(v => v).all();
        values.road = collect({...this.road}).filter(v => v).all();
        values.unlocks = collect({...this.unlocks}).filter(v => v).all();
        values.characters = collect({...this.characters}).filter(v => v).all();
        return values;
    }

    key() {
        return 'sheet';
    }
}

Object.assign(Sheet.prototype, {
    parentRead: Storable.read,
    parentValuesToStore: Storable.valuesToStore,
    store: Storable.store,
});

export default Sheet;
