import ScenarioRepository from "../repositories/ScenarioRepository";

export default class TreasureValidator {

    validate() {
        app.scenarios.each((scenario) => {
            this.checkUnlockedItem(scenario);
        });
    }

    checkUnlockedItem(scenario) {
        if (scenario.treasures.length) {
            scenario.treasures.forEach(id => {
                this.scenarioRepository.processTreasureItems(scenario, id, scenario.isTreasureUnlocked(id));
            });
        }
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }
}
