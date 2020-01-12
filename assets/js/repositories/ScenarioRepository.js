import scenarios from '../scenarios.json';
import Scenario from "../models/Scenario";
import Edge from "../models/Edge";

let collect = require('collect.js');

export default class ScenarioRepository {
    fetch() {
        return collect(scenarios.scenarios).map((scenario) => {
            scenario = new Scenario(scenario);
            scenario = this.fetchEdges(scenario);

            return scenario;
        })
    }

    fetchEdges(scenario) {
        scenario.edges = collect(scenarios.edges).where('source', scenario.id).map((edge) => {
            return new Edge(edge);
        });

        return scenario;
    }

    find(id) {
        return app.scenarios.firstWhere('id', id);
    }
}
