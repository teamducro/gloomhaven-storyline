import {ScenarioState} from "../models/ScenarioState";
import ScenarioRepository from "../repositories/ScenarioRepository";
import ScenarioValidator from "./ScenarioValidator";

const queryString = require('query-string');

export default class ShareState {
    load() {
        let result = this.decode();

        if (result.hasOwnProperty('states')) {
            this.scenarioRepository.hideAllScenarios();

            result.states.each((state, id) => {
                this.scenarioRepository.find(parseInt(id)).state = ScenarioState.make(state);
            });

            if (result.hasOwnProperty('choices')) {
                result.choices.each((choice, id) => {
                    this.scenarioRepository.find(parseInt(id)).choice = choice;
                });
            }

            if (result.hasOwnProperty('treasures')) {
                result.treasures.each((treasures, id) => {
                    treasures.forEach((treasure) => {
                        this.scenarioRepository.find(parseInt(id)).unlockTreasure(treasure);
                    });
                });
            }

            this.scenarioValidator.validate();
            location.href = this.url();
        }
    }

    link() {
        return this.url() + '?' + this.encode();
    }

    encode() {
        let result = {};

        let statesString = app.scenarios.where('state', '!=', ScenarioState.hidden)
            .pluck('state', 'id').map((state, id) => {
                return id + '_' + state.substr(0, 1);
            }).values().implode('-');

        let choicesString = app.scenarios.where('state', ScenarioState.complete)
            .where('hasChoices', true).pluck('choice', 'id').map((choice, id) => {
                return id + '_' + choice
            }).values().implode('-');

        let treasuresString = app.scenarios.pluck('unlockedTreasures', 'id').map((treasures, id) => {
            if (treasures.length) {
                return id + '_' + treasures.join('_');
            }
            return false;
        }).filter().values().implode('-');

        if (statesString) {
            result.states = statesString;
        }

        if (choicesString) {
            result.choices = choicesString;
        }

        if (treasuresString) {
            result.treasures = treasuresString;
        }

        return queryString.stringify(result);
    }

    decode() {
        let parsed = queryString.parse(location.search);
        let result = {};

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

        if (typeof parsed.treasures !== 'undefined') {
            result.treasures = collect(parsed.treasures.split('-')).mapWithKeys((choice) => {
                let parts = choice.split('_');
                let id = parts.shift();
                return [id, parts.map((x) => x)];
            });
        }

        return result;
    }

    url() {
        return location.protocol + '//' + location.host + location.pathname;
    }

    get scenarioRepository() {
        return this.scenarioRepository2 || (this.scenarioRepository2 = new ScenarioRepository);
    }

    get scenarioValidator() {
        return this.scenarioValidator2 || (this.scenarioValidator2 = new ScenarioValidator);
    }
}
