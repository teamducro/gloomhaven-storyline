import PromptConfig from "../models/PromptConfig";
import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";

class ChoiceService {
    constructor() {
    }

    setChoice(id, value) {
        this.findScenariosWithChoice(id)
            .each((s) => {
                s.promptChoice = value;
            });
    }

    findScenariosWithChoice(id) {
        return this.scenarioRepository
            .where((s) => {
                return s.prompt === id;
            });
    }

    getPromptConfig(scenario) {
        switch (scenario.prompt) {
            case "dragonChoice":
                let drakesTreasure = this.achievementRepository.find("PTDT");
                let drakesCommand = this.achievementRepository.find("PTDC");

                return new PromptConfig({
                    show: !this.isChoiceSet(scenario.prompt) && drakesCommand.awarded && drakesTreasure.awarded,
                    title: "prompt.dragonChoice.title",
                    text: "prompt.dragonChoice.text",
                    scenario: scenario,
                    options: [
                        {
                            id: "dragonChoice1",
                            text: "prompt.dragonChoice.dragonChoice1",
                            value: "dragonChoice1"
                        },
                        {
                            id: "dragonChoice2",
                            text: "prompt.dragonChoice.dragonChoice2",
                            value: "dragonChoice2"
                        }
                    ],
                    callback: (value) => {
                        if (value === "dragonChoice1") {
                            this.achievementRepository.gain("GTDA")
                        } else {
                            this.achievementRepository.lose("GTDA")
                        }
                        this.setChoice(scenario.prompt, value);
                    }
                });
        }

        return undefined;
    }

    isChoiceSet(id) {
        return this.findScenariosWithChoice(id)
            .contains((s) => {
                return s.promptChoice
            });
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }
}

export default ChoiceService;
