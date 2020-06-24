import {ScenarioState} from "../models/ScenarioState";
import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";
import AchievementGroup from "../models/AchievementGroup";
import Helpers from "./Helpers";
import Reseter from "./Reseter";
import ChoiceService from "./ChoiceService";

const queryString = require('query-string');

export default class ShareState {
    load() {
        let result = this.decode();

        if (result.hasOwnProperty('states')) {
            this.reseter.reset();
            app.switchLocal();

            if (result.hasOwnProperty('groups')) {
                result.groups.each((achievements, id) => {
                    (new AchievementGroup(id)).achievements = achievements;
                });
            }

            result.states.each((state, id) => {
                this.scenarioRepository.changeState(id, ScenarioState.make(state), false);
            });

            if (result.hasOwnProperty('choices')) {
                result.choices.each((choice, id) => {
                    this.scenarioRepository.find(id).choice = choice;
                });
            }

            if (result.hasOwnProperty('promptChoices')) {
                result.promptChoices.each((choice, id) => {
                    let scenario = this.scenarioRepository.find(id);
                    let promptConfig = this.choiceService.getPromptConfig(scenario);
                    if (typeof promptConfig.callback === 'function') {
                        promptConfig.callback(choice);
                    }
                    scenario.promptChoice = choice;
                });
            }

            if (result.hasOwnProperty('treasures')) {
                result.treasures.each((treasures, id) => {
                    treasures.forEach((treasure) => {
                        this.scenarioRepository.find(id).unlockTreasure(treasure);
                    });
                });
            }

            location.href = this.url() + '#/story';
        }
    }

    link() {
        return this.url() + '?' + this.encode();
    }

    encode() {
        let result = {};

        result.groups = this.achievementRepository.groups()
            .filter((group) => group.achievements.length)
            .pluck('achievements', 'id').map((achievements, id) => {
                return id + '_' + achievements.join('_');
            }).values().implode('-');

        result.states = app.scenarios.where('state', '!=', ScenarioState.hidden)
            .pluck('state', 'id').map((state, id) => {
                return id + '_' + state.substr(0, 1);
            }).values().implode('-');

        result.choices = app.scenarios.where('state', ScenarioState.complete)
            .where('hasChoices', true).pluck('choice', 'id').map((choice, id) => {
                return id + '_' + choice
            }).values().implode('-');

        result.promptChoices = app.scenarios.where('state', ScenarioState.complete)
            .where('hasPrompt', true).pluck('promptChoice', 'id').map((choice, id) => {
                return id + '_' + choice
            }).values().implode('-');

        result.treasures = app.scenarios.pluck('unlockedTreasures', 'id').map((treasures, id) => {
            if (treasures.length) {
                return id + '_' + treasures.join('_');
            }
            return false;
        }).filter().values().implode('-');

        return queryString.stringify(_.pickBy(result, (value) => value));
    }

    decode() {
        let parsed = queryString.parse(location.search);
        let result = {};

        if (typeof parsed.groups !== 'undefined') {
            result.groups = collect(parsed.groups.split('-')).mapWithKeys((group) => {
                let parts = group.split('_');
                let id = parts.shift();
                return [id, parts];
            });
        }

        if (typeof parsed.states !== 'undefined') {
            result.states = collect(parsed.states.split('-')).mapWithKeys((state) => {
                let parts = state.split('_');
                return [parts[0], parts[1].substr(0, 1)];
            });
        }

        if (typeof parsed.choices !== 'undefined') {
            result.choices = collect(parsed.choices.split('-')).mapWithKeys((choice) => {
                let parts = choice.split('_');
                return [parts[0], parseInt(parts[1])];
            });
        }

        if (typeof parsed.promptChoices !== 'undefined') {
            result.promptChoices = collect(parsed.promptChoices.split('-')).mapWithKeys((choice) => {
                let parts = choice.split('_');
                return [parts[0], parts[1]];
            });
        }

        if (typeof parsed.treasures !== 'undefined') {
            result.treasures = collect(parsed.treasures.split('-')).mapWithKeys((choice) => {
                let parts = choice.split('_');
                let id = parts.shift();
                return [id, parts];
            });
        }

        return result;
    }

    url() {
        return Helpers.inProduction()
            ? process.env.MIX_APP_URL
            : location.protocol + '//' + location.host;
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }

    get choiceService() {
        return this._choiceService || (this._choiceService = new ChoiceService);
    }

    get reseter() {
        return this._reseter || (this._reseter = new Reseter);
    }
}
