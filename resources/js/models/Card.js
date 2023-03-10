class Card {

    constructor(str, game) {
        const parts = str.split('-');
        this.id = parts[1];
        this.type = parts[0].toUpperCase(); // R, C, Q, RIFT
        this._title = parts.length > 2 ? parts[2] : null;
        this.game = game;
    }

    get translatedType() {
        return `card_types.${this.type}`;
    }

    get images() {
        // FC uses GH cards
        const gameFolder = this.game === 'fc' ? 'gh' : this.game;

        switch (this.type) {
            case "R":
            case "C":
            case "RIFT":
                return [`/img/cards/${gameFolder}/${this.folder}/${this.id}-f.jpg`, `/img/cards/${gameFolder}/${this.folder}/${this.id}-b.jpg`];
            case "Q":
                return [`/img/cards/${gameFolder}/${this.folder}/${this.id}.jpg`, `/img/cards/${gameFolder}/${this.folder}/back.jpg`];
            default:
                return [];
        }
    }

    get folder() {
        const typeMap = {
            'R': 'road',
            'C': 'city',
            'Q': 'quest',
            'RIFT': 'rift'
        };

        return typeMap[this.type] || null;
    }
}

export default Card
