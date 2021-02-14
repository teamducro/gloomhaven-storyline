export default class ScenarioTextParser {
    parse(text) {
        let list = collect({});

        if (text.includes('Scenario #')) {
            let scenarios = text.match(/Scenario #\d+/g);
            scenarios.forEach((scenario) => {
                const id = parseInt(scenario.replace(/\D/g, ''));
                list.put(id, scenario);
            });
        }

        return list;
    }

    ids(text) {
        return this.parse(text).keys().map(parseInt);
    }
}
