import {ScenarioState} from "./ScenarioState";

export default class Scenario {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.pages = data.pages;
        this.requirments = data.requirments;
        this.chapter_id = data.chapter_id;
        this.chapter_name = null;
        this.choices = data.choices;
        this.choice2 = null;
        this.hasChoices = typeof data.choices !== 'undefined';
        this.state2 = ScenarioState.hidden;
        this.notes = "";
        this.links_to = collect(data.links_to);
        this.linked_from = collect(data.linked_from);
        this.blocked_by = collect(data.blocked_by);
        this.required_by = collect(data.required_by);
        this.read();
    }

    isHidden() {
        return this.state === ScenarioState.hidden;
    }

    isVisible() {
        return this.state !== ScenarioState.hidden;
    }

    isComplete() {
        return this.state === ScenarioState.complete;
    }

    isIncomplete() {
        return this.state === ScenarioState.incomplete;
    }

    isBlocked() {
        return this.state === ScenarioState.blocked;
    }

    isRequired() {
        return this.state === ScenarioState.required;
    }

    set state(state) {
        this.state2 = state;
        this.store();
    }

    get state() {
        return this.state2;
    }

    set choice(choice) {
        this.choice2 = choice;
        this.store();
    }

    get choice() {
        return this.choice2;
    }

    store() {
        window.localStorage.setItem(this.key(), JSON.stringify({
            "state": this.state,
            "choice": this.choice,
            "notes": this.notes
        }));
    }

    read() {
        let scenario = JSON.parse(window.localStorage.getItem(this.key()));
        if (scenario) {
            this.state2 = scenario.state;
            this.choice2 = scenario.choice;
            this.notes = scenario.notes;
        }
    }

    key() {
        return 'scenario-' + this.id;
    }
}
