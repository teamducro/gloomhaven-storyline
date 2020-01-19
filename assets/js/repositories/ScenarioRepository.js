import scenarios from '../scenarios.json';
import Scenario from "../models/Scenario";

export default class ScenarioRepository {

    fetch() {
        return collect(scenarios.scenarios).map((scenario) => {
            scenario = new Scenario(scenario);
            scenario = this.fetchEdges(scenario);

            return scenario;
        })
    }

    fetchEdges(scenario) {
        scenario.links_to = this.links
            .where('source', scenario.id)
            .map((edge) => {
                return edge.target;
            });

        scenario.linked_from = this.links
            .where('target', scenario.id)
            .map((edge) => {
                return edge.source;
            });

        scenario.blocked_by = this.blocks
            .where('target', scenario.id)
            .map((edge) => {
                return edge.source;
            });

        scenario.required_by = this.requires
            .where('target', scenario.id)
            .map((edge) => {
                return edge.source;
            });

        return scenario;
    }

    find(id) {
        return app.scenarios.firstWhere('id', id);
    }

    findMany(list) {
        return collect().wrap(list).map((id) => {
            return this.find(id);
        })
    }

    get edges() {
        return this.edges2 || (this.edges2 = collect(scenarios.edges));
    }

    get links() {
        return this.links2 || (this.links2 = this.edges.whereIn('type', ['unlocks', 'linksto']));
    }

    get blocks() {
        return this.blocks2 || (this.blocks2 = this.edges.where('type', 'blocks'));
    }

    get requires() {
        return this.requires2 || (this.requires2 = this.edges.where('type', 'requiredby'));
    }
}
