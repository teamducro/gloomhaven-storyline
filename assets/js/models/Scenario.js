import {ScenarioState} from "./ScenarioState";

export default class Scenario {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.pages = data.pages;
        this.requirments = data.requirments;
        this.state2 = ScenarioState.hidden;
        this.notes = "";
        this.links_to = null;
        this.linked_from = null;
        this.blocked_by = null;
        this.required_by = null;
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

    store() {
        window.localStorage.setItem(this.key(), JSON.stringify({
            "state": this.state,
            "notes": this.notes
        }));
    }

    read() {
        let scenario = JSON.parse(window.localStorage.getItem(this.key()));
        if (scenario) {
            this.state2 = scenario.state;
            this.notes = scenario.notes;
        }
    }

    key() {
        return 'scenario-' + this.id;
    }
}
