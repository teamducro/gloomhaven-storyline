import {ScenarioState} from "../models/ScenarioState";
import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";
import AchievementGroup from "../models/AchievementGroup";
import Helpers from "./Helpers";
import Reseter from "./Reseter";
import ChoiceService from "./ChoiceService";
import LZString from "lz-string";
import store from "store/dist/store.modern";

const queryString = require('query-string');

export default class ShareState {
    hasNewLink() {
        this.result = this.decodeNewLink();

        return !!this.result;
    }

    loadNewLink() {
        let result = this.result || this.decodeNewLink();

        if (result) {
            app.switchLocal();

            store.set(app.campaignId, result.storage);
        }
    }

    loadOldLink() {
        let result = this.decodeOldLink();

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

    encodeMap() {
        return {
            'scenario': '_s_',
            '"state":': '_st_',
            'achievement': '_a_',
            '"awarded":': '_aw_',
            '"complete"': '_c_',
            '"choice":': '_ch_',
            '"count":': '_co_',
            '"incomplete"': '_i_',
            '"blocked"': '_b_',
            '"hidden"': '_h_',
            '"promptChoice":': '_p_',
            '"notes":': '_n_',
            '"treasures":': '_t_',
            '"lost":': '_l_',
        }
    }

    encode() {
        let input = JSON.stringify(app.campaignData);

        collect(this.encodeMap()).each((replace, search) => {
            const regEx = new RegExp(search, 'g');
            input = input.replace(regEx, replace);
        });
        const compressed = LZString.compressToEncodedURIComponent(input);

        return queryString.stringify({storage: compressed});
    }

    decodeNewLink() {
        let parsed = queryString.parse(location.search);

        if (typeof parsed.storage !== 'undefined') {
            let decompressed = LZString.decompressFromEncodedURIComponent(parsed.storage)
            collect(this.encodeMap()).each((search, replace) => {
                const regEx = new RegExp(search, 'g');
                decompressed = decompressed.replace(regEx, replace);
            });

            return {
                storage: JSON.parse(decompressed)
            };
        }
    }

    decodeOldLink() {
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
