export default class ScenarioTextParser {
    parse(text) {
        let list = collect({});

        if (text.includes('{SCENARIO')) {
            let scenarios = text.match(/{SCENARIO \d+}/g) || [];
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
