import ScenarioRepository from "../repositories/ScenarioRepository";
import {ScenarioState} from "../models/ScenarioState";

export default class QuestValidator {
    validate() {
        app.quests.each((quest) => {
            quest.stage = undefined;
            quest.checks.forEach((check, index) => {
                if (this.evaluate(check)) {
                    quest.stage = index;
                }
            });
        });
    }

    /**
     * valid checks:
     *
     * scenario states
     * [scenario_id]==c | 1==c | 2!=c
     *
     * scenario choices
     * [scenario_id]'==[chosen_prompt_value] | 1==1 | 1!=2
     * [scenario_id]'==[chosen_scenario_id] | 1==3 | 1!=4
     *
     * unlocked treasure
     * [scenario_id]t[treasure_id]==[boolean] | 1t2==1 | 1t3==0
     *
     * @param check string
     * @returns boolean
     */
    evaluate(check = '') {
        check = check.replace(/ /g, '');

        if (!check || check.length === 0) {
            return true;
        }

        check = check.replace(/\d*'?(t\d*)?[!=]=/gm, (value) => {
            const id = value.split(/['t!=]/g).shift();
            const scenario = this.scenarioRepository.find(id);
            const operator = value.slice(-2);
            let result = '';

            // check scenario state
            if (!value.includes("'") && !value.includes("t")) {
                result = '"' + scenario.state + '"';
            }
            // check choice
            else if (value.includes("'")) {
                if (scenario.hasPrompt) {
                    result = scenario.promptChoice;
                } else if (scenario.hasChoices) {
                    result = scenario.choice;
                }
            }
            // check treasure
            else if (value.includes("t")) {
                const treasureId = value.slice(id.length + 1, -2)
                result = scenario.isTreasureUnlocked(treasureId);
            }

            return result + operator;
        })
        check = check.replace(/=c/g, '="' + ScenarioState.complete + '"');

        return Function('"use strict";return (' + check + ')')();
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }
}
