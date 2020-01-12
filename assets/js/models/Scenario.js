export default class Scenario {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.pages = data.pages;
        this.status = this.id === 1 ? "incomplete" : "hidden";
        this.notes = "";
        this.read();
    }

    isHidden() {
        return this.status === 'hidden'
    }

    isComplete() {
        return this.status === 'complete'
    }

    isIncomplete() {
        return this.status === 'incomplete'
    }

    store() {
        window.localStorage.setItem(this.key(), JSON.stringify({
            "status": this.status,
            "notes": this.notes
        }));
    }

    read() {
        let scenario = JSON.parse(window.localStorage.getItem(this.key()));
        if (scenario) {
            this.status = scenario.status;
            this.notes = scenario.notes;
        }
    }

    key() {
        return 'scenario-' + this.id;
    }
}
