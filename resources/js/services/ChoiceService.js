import PromptConfig from "../models/PromptConfig";
import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";
import {ScenarioState} from "../models/ScenarioState";

class ChoiceService {
    constructor() {
    }

    getPromptConfig(scenario) {
        switch (scenario.prompt) {
            case 'dragons':
                let drakesTreasure = this.achievementRepository.find('PTDT');
                let drakesCommand = this.achievementRepository.find('PTDC');

                return new PromptConfig(scenario, {
                    options: 2,
                    show: !this.isChoiceSet(scenario.prompt) && drakesCommand.awarded && drakesTreasure.awarded,
                    promptAfter: false,
                    callback: (id) => {
                        if (id === 1) {
                            this.achievementRepository.gain('GTDA');
                        } else {
                            this.achievementRepository.lose('GTDA');
                        }
                        this.setChoice(scenario, id, false);
                    }
                });

            case 'burningMountain':
                return new PromptConfig(scenario, {
                    options: 2,
                    callback: (id) => {
                        this.setChoice(scenario, id);
                    }
                });

            case 'merchantsBay':
                return new PromptConfig(scenario, {
                    options: 3,
                    callback: (value) => {
                        if (value) {
                            // achievements
                            if (value === 1) {
                                this.achievementRepository.gain('PC');
                            } else {
                                this.achievementRepository.remove('PC');
                            }

                            // scenarios
                            if (value === 1) {
                                this.scenarioRepository.choose(scenario, '102,103');
                            }
                            if (value === 2) {
                                this.scenarioRepository.choose(scenario, 102);
                            }
                            if (value === 3) {
                                this.scenarioRepository.choose(scenario, 103);
                            }
                        } else {
                            // reset
                            this.achievementRepository.remove('PC');
                            this.scenarioRepository.choose(scenario, null);
                            this.scenarioRepository.setHidden(102);
                            this.scenarioRepository.setHidden(103);
                        }

                        this.setChoice(scenario, value);
                    }
                });

            case 'aftershocks':
                return new PromptConfig(scenario, {
                    options: 2,
                    callback: (value) => {
                        if (value) {
                            // scenarios
                            if (value === 1) {
                                this.scenarioRepository.choose(scenario, 104);
                            }
                            if (value === 2) {
                                this.scenarioRepository.choose(scenario, '104,105');
                            }
                        } else {
                            // reset
                            this.scenarioRepository.choose(scenario, null);
                            this.scenarioRepository.setHidden(104);
                            this.scenarioRepository.setHidden(105);
                        }

                        this.setChoice(scenario, value);
                    }
                });

            case 'bloodyWar':
                return new PromptConfig(scenario, {
                    options: 3,
                    callback: (value) => {
                        // reset
                        this.achievementRepository.remove('PXA');
                        this.achievementRepository.remove('PDA');
                        this.achievementRepository.remove('PAD');

                        if (value === 1) {
                            this.achievementRepository.gain('PXA');
                        } else if (value === 2) {
                            this.achievementRepository.gain('PDA');
                        } else if (value === 3) {
                            this.achievementRepository.gain('PAD');
                        }

                        this.setChoice(scenario, value);
                    }
                });
        }

        return undefined;
    }

    setChoice(scenario, value, setComplete = true) {
        if (value !== null && setComplete) {
            this.scenarioRepository.changeState(scenario, ScenarioState.complete);
        }

        this.findScenariosWithChoice(scenario.prompt).each((s) => {
            s.promptChoice = value;
        });
    }

    isChoiceSet(id) {
        return this.findScenariosWithChoice(id).contains((s) => {
            return s.promptChoice
        });
    }

    findScenariosWithChoice(id) {
        return this.scenarioRepository.where((s) => {
            return s.prompt === id;
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
