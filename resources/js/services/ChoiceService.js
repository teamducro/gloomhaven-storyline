import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";

export default class ChoiceService {
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
        const self = this;

        switch (scenario.prompt) {
            case "dragonChoice" :
                let drakesTreasure = this.achievementRepository.find("PTDT");
                let drakesCommand = this.achievementRepository.find("PTDC");
                return {
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
                    callback: function (value) {
                        if (value === "dragonChoice1") {
                            self.achievementRepository.gain("GTDA")
                        } else {
                            self.achievementRepository.lose("GTDA")
                        }
                        self.setChoice(scenario.prompt, value);
                    }
                };
        }
        return null;
    }

    isChoiceSet(id) {
        return this.findScenariosWithChoice(id)
            .contains((s) => {
                return s.promptChoice
            });
    }

    get scenarioRepository() {
        return this.scenarioRepository2 || (this.scenarioRepository2 = new ScenarioRepository);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }
}