import {ScenarioState} from "../models/ScenarioState";
import ScenarioRepository from "../repositories/ScenarioRepository";
import ScenarioValidator from "./ScenarioValidator";

const queryString = require('query-string');

export default class ShareState {
    load() {
        let result = this.decode();

        if (result.hasOwnProperty('completed')) {
            result.completed.each((id) => {
                this.scenarioRepository.find(id).state = ScenarioState.complete;
            });

            if (result.hasOwnProperty('choices')) {
                result.choices.each((choice, id) => {
                    this.scenarioRepository.find(parseInt(id)).choice = choice;
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
        let completed = app.scenarios.where('state', ScenarioState.complete);
        let result = {};
        let completedString = completed.pluck('id').implode('-');
        let choicesString = completed.where('hasChoices', true).pluck('choice', 'id').map((choice, id) => {
            return id + '_' + choice
        }).values().implode('-');

        if (completedString) {
            result.completed = completedString;
        }

        if (choicesString) {
            result.choices = choicesString;
        }

        return queryString.stringify(result);
    }

    decode() {
        let parsed = queryString.parse(location.search);
        let result = {};

        if (typeof parsed.completed !== 'undefined') {
            result.completed = collect(parsed.completed.split('-')).map(id => parseInt(id));
        }

        if (typeof parsed.choices !== 'undefined') {
            result.choices = collect(parsed.choices.split('-')).mapWithKeys((choice) => {
                let parts = choice.split('_');
                return [parts[0], parseInt(parts[1])];
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
