class Card {

    constructor(str, game) {
        const parts = str.split('-');
        this.id = parts[1];
        this.type = parts[0].toUpperCase();
        this._title = parts.length > 2 ? parts[2] : null;
        this.game = game;
    }

    get title() {
        if (this._title) {
            return this._title;
        }

        switch (this.type) {
            case "R":
                return "Road Event #" + this.id;
            case "C":
                return "City Event #" + this.id;
            case "Q":
                return "Personal Quest #" + this.id;
            default:
                return "";
        }
    }

    get images() {
        // FC uses GH cards
        const folder = this.game === 'fc' ? 'gh' : this.game;

        switch (this.type) {
            case "R":
                return [`/img/cards/${folder}/road/${this.id}-f.jpg`, `/img/cards/${folder}/road/${this.id}-b.jpg`];
            case "C":
                return [`/img/cards/${folder}/city/${this.id}-f.jpg`, `/img/cards/${folder}/city/${this.id}-b.jpg`];
            case "Q":
                return [`/img/cards/${folder}/quest/${this.id}.jpg`];
            default:
                return [];
        }
    }
}

export default Card
