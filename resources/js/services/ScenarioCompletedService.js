import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";
import CompletionConfig from "../models/CompletionConfig";

class ScenarioCompletedService {
    constructor() {
        this.scenarios = {
            106: 'unlock_112',
            107: 'unlock_112'
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
                    // Reveal scenario 112 after GPOA3 is awarded
                    if (this.achievementRepository.find('GPOA3').awarded) {
                        this.scenarioRepository.choose(scenario, 112);
                    }
                }, () => {
                    // Hide scenario 112 when undoing
                    if (!this.achievementRepository.find('GPOA3').awarded) {
                        this.scenarioRepository.choose(scenario, null);
                    }
                })
        }

        return undefined;
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }
}

export default ScenarioCompletedService;
