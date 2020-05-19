import ScenarioRepository from "../repositories/ScenarioRepository";
import {ScenarioState} from "../models/ScenarioState";

export default class QuestValidator {
    validate() {
        app.quests.each((quest) => {
            quest.stage = undefined;
            quest.checks.forEach((check, index) => {
                if (this.check(check)) {
                    quest.stage = index;
                }
            });
        });
    }

    check(check) {
        check = check.replace(/ /g, '');

        if (!check || check.length === 0) {
            return true;
        }

        check = check.replace(/\d*'?[!=]=/gm, (value) => {
            let id = parseInt(value.replace(/\D/g, ''));
            let scenario = this.scenarioRepository.find(id);
            let operator = value.slice(-2);

            // check state
            if (!value.includes("'")) {
                return '"' + scenario.state + '"' + operator;
            }
            // check choice
            else {
                return scenario.choice + operator;
            }
        });
        const c = ScenarioState.complete;

        return eval(check);
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }
}
