import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";
import CompletionConfig from "../models/CompletionConfig";

class ScenarioCompletedService {
    constructor() {
        this.scenarios = app.game === 'fh' ? {} : {
            106: 'unlock_112',
            107: 'unlock_112',

            110: 'unlock_114',
            111: 'unlock_114',
            112: 'unlock_114',
            113: 'unlock_114'
        }
    }

    hasHandler(scenario) {
        return Boolean(this.scenarios[scenario.id]);
    }

    complete(scenario, complete = true) {
        if (this.hasHandler(scenario)) {
            if (complete) {
                this.handler(scenario).completion();
            } else {
                this.handler(scenario).rollback();
            }
        }
    }

    rollback(scenario) {
        return this.complete(scenario, false);
    }

    handler(scenario) {
        switch (this.scenarios[scenario.id]) {
            case 'unlock_112':
                return new CompletionConfig(() => {
                    // Reveal scenario 112 after GPOA is awarded 3x
                    if (this.achievementRepository.find('GPOA').count === 3) {
                        this.scenarioRepository.choose(scenario, 112);
                    }
                }, () => {
                    // Hide scenario 112 when undoing
                    if (this.achievementRepository.find('GPOA').count < 3) {
                        this.findScenariosWithChosenScenario(112).each((s) => {
                            this.scenarioRepository.choose(s, null);
                        });
                    }
                })
            case 'unlock_114':
                return new CompletionConfig(() => {
                    // Reveal scenario 114 after GPA is awarded twice
                    if (this.achievementRepository.find('GPA').count === 2) {
                        this.scenarioRepository.choose(scenario, 114);
                    }
                }, () => {
                    // Hide scenario 114 when undoing
                    if (this.achievementRepository.find('GPA').count < 2) {
                        this.findScenariosWithChosenScenario(114).each((s) => {
                            this.scenarioRepository.choose(s, null);
                        });
                    }
                })
        }

        return undefined;
    }

    findScenariosWithChosenScenario(id) {
        return this.scenarioRepository.whereKeyValue('_choice', id);
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }
}

export default ScenarioCompletedService;
