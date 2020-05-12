import {ScenarioState} from "../models/ScenarioState";

export default class CheckExpressionString {

    constructor(scenarioRepository, achievementRepository) {
        this.scenarioRepository = scenarioRepository;
        this.achievementRepository = achievementRepository;
    }

    handle(expression) {
        expression = expression.replace(/ /g, '');

        if (!expression || expression.length === 0) {
            return true;
        }

        const check = expression.replace(/\{([^}]+)\}/gm, (value) => {
            value = value.substr(1, value.length - 2);
            const id = value.substr(0, value.includes('.') ? value.indexOf('.') : value.length);

            // check Achievements
            if (isNaN(id)) {
                const count = value.includes('count');
                let achievement = this.achievementRepository.find(id);
                
                if (count) {
                    return achievement.count;
                } else {
                    return achievement.awarded;
                }
            }
            // check scenarios
            else {
                const choice = value.includes('choice');
                let scenario = this.scenarioRepository.find(id);

                if (choice) {
                    return scenario.choice;
                } else {
                    return `"${scenario.state}"`;
                }
            }
        });

        const c = ScenarioState.complete;
        const i = ScenarioState.incomplete;

        return eval(check);
    }
}
