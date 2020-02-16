import ScenarioRepository from "../repositories/ScenarioRepository";
import {ScenarioState} from "../models/ScenarioState";

export default class QuestValidator {
    validate() {
        app.quests.each((quest) => {
            quest.stage = 0;
            quest.checks.forEach((check, index) => {
                if (this.check(check)) {
                    quest.stage = index;
                }
            });
        });
    }

    check(check) {
        check = check.replace(' ', '');

        if (!check || check.length === 0) {
            return true;
        }

        check = check.replace(/\d*==/gm, (id) => {
            id = parseInt(id.replace('=', ''));
            return '"' + this.scenarioRepository.find(id).state + '"==';
        });
        const c = ScenarioState.complete;
        const i = ScenarioState.incomplete;

        return eval(check);
    }

    get scenarioRepository() {
        return this.scenarioRepository2 || (this.scenarioRepository2 = new ScenarioRepository);
    }
}
