import {ScenarioState} from "./ScenarioState";
import Card from "./Card";
import store from "store/dist/store.modern";

export default class Scenario {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.title = this.name.substr(this.name.indexOf(' ') + 1);
        this.coordinates = data.coordinates;
        this.is_side = data.is_side || false;
        this.pages = data.pages || [];
        this.requirements = data.requirements || "";
        this.quests = data.quests || [];
        this.cards = collect(data.cards).map((card) => new Card(card));
        this.chapter_id = data.chapter_id;
        this.chapter_name = null;
        this.region_ids = data.region_ids || [];
        this.regions = null;
        this.choices = data.choices;
        this.choice2 = null;
        this.hasChoices = typeof data.choices !== 'undefined';
        this.state2 = ScenarioState.hidden;
        this.notes = "";
        this.links_to = collect(data.links_to);
        this.linked_from = collect(data.linked_from);
        this.required_by = collect(data.required_by) || [];
        this.treasures = collect(data.treasures);
        this.treasures_from = collect(data.treasures_from);
        this.treasures_to = collect(data.treasures_to);
        this.rewards = collect(data.rewards);
        this.unlockedTreasures = [];
        this.achievements_awarded = collect(data.achievements_awarded);
        this.achievements_lost = collect(data.achievements_lost);
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

    unlockTreasure(id, unlock = true) {
        if (this.treasures.has(id)) {
            if (unlock) {
                if (!this.isTreasureUnlocked(id)) {
                    this.unlockedTreasures.push(id);
                }
            } else {
                this.unlockedTreasures.splice(this.unlockedTreasures.indexOf(id));
            }
        }

        this.store();
    }

    lockTreasure(id) {
        this.unlockTreasure(id, false);
    }

    isTreasureUnlocked(id) {
        return this.unlockedTreasures.indexOf(id) >= 0
    }

    inRegion(id) {
        return this.region_ids.indexOf(id) >= 0
    }

    missedTreasures() {
        return this.isComplete() && this.treasures.count() > this.unlockedTreasures.length;
    }

    hasCard() {
        return this.cards.count() > 0;
    }

    image() {
        return '/img/scenarios/' + this.id + (this.isComplete() ? '_c' : '') + '.png'
    }

    store() {
        store.set(this.key(), {
            "state": this.state,
            "choice": this.choice,
            "notes": this.notes,
            "treasures": this.unlockedTreasures
        });
    }

    read() {
        let scenario = store.get(this.key());
        if (scenario) {
            this.state2 = scenario.state;
            this.choice2 = scenario.choice;
            this.notes = scenario.notes;
            this.unlockedTreasures = scenario.treasures || [];
        }
    }

    key() {
        return 'scenario-' + this.id;
    }
}
