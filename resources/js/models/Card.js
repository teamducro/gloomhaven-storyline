import {ScenarioState} from "./ScenarioState";

export default class Card {

    constructor(str) {
        const parts = str.split('-');
        this.id = parts[1];
        this.type = parts[0];
        this.title2 = parts.length > 2 ? parts[2] : null;
    }

    get title() {
        if (this.title2) {
            return this.title2;
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
        switch (this.type) {
            case "R":
                return [`/img/cards/road/${this.id}-f.png`, `/img/cards/road/${this.id}-b.png`];
            case "C":
                return [`/img/cards/city/${this.id}-f.png`, `/img/cards/city/${this.id}-b.png`];
            case "Q":
                return [`/img/cards/quest/${this.id}.png`];
            default:
                return [];
        }
    }
}
