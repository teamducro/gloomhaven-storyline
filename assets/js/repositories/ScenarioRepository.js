import scenarios from '../scenarios.json';
import Scenario from "../models/Scenario";

let collect = require('collect.js');

export default class ScenarioRepository {
    static fetch() {
        return collect(scenarios.scenarios).map((scenario) => {
            return new Scenario(scenario);
        })
    }
}
