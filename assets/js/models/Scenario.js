export default class Scenario {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.pages = data.pages;
        this.status = this.id === 1 ? "incomplete" : "hidden";
        this.notes = "";
        this.read();
    }

    store() {
        window.localStorage.setItem(this.key(), JSON.stringify({
            "status": this.status,
            "notes": this.notes
        }));
    }

    read() {
        let scenario = window.localStorage.getItem(this.key());
        if (scenario) {
            this.status = scenario.status;
            this.notes = scenario.notes;
        }
    }

    key() {
        return 'scenario-' + this.id;
    }
}
