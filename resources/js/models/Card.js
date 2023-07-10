class Card {

    constructor(str, game) {
        const parts = str.split('-');
        this.id = parts[1];
        this.type = parts[0].toUpperCase(); // R, C, Q, RIFT, SR, SO, WR, WO, B
        this._title = parts.length > 2 ? parts[2] : null;
        this.game = game;
    }

    get translatedType() {
        return `card_types.${this.type}`;
    }

    get images() {
        // FC uses GH cards
        const gameFolder = this.game === 'fc' ? 'gh' : this.game;

        if (["R", "C", "RIFT", "SR", "SO", "WR", "WO", "B"].includes(this.type)) {
            return [`/img/cards/${gameFolder}/${this.folder}/${this.id}-f.jpg`, `/img/cards/${gameFolder}/${this.folder}/${this.id}-b.jpg`];
        } else if (this.type === "Q") {
            return [`/img/cards/${gameFolder}/${this.folder}/${this.id}.jpg`, `/img/cards/${gameFolder}/${this.folder}/back.jpg`];
        }

        return [];
    }

    get folder() {
        const typeMap = {
            'R': 'road',
            'C': 'city',
            'Q': 'quest',
            'RIFT': 'rift',
            'SR': 'summerRoad',
            'SO': 'summerOutpost',
            'WR': 'winterRoad',
            'WR': 'winterOutpost',
            'B': 'boat',
        };

        return typeMap[this.type] || null;
    }
}

export default Card
