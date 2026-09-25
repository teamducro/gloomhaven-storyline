export default class ItemTextParser {
    parse(text) {
        let list = collect({});

        if (text.includes('(')) {
            // The id itself may contain a space (e.g. crossover pack ids like "CA A"),
            // so only the leading "Item"/label word is a single \w+ token.
            let items = text.match(/“[^”()]+”[^”()]+\(\w+ [\w ]+\)/g) || [];
            items.forEach((item) => {
                const id = item.match(/\(\w+ ([\w ]+)\)$/)[1];
                list.put(isNaN(id) ? id : parseInt(id), item);
            });
        }

        return list;
    }

    ids(text) {
        return this.parse(text).keys();
    }
}
