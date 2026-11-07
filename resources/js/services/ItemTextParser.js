export default class ItemTextParser {
    parse(text) {
        let list = collect({});

        if (text.includes('(')) {
            // The id itself may contain a space (e.g. crossover pack ids like "CA A"),
            // so only the leading "Item"/label word is a single token, in letters of any script ("Felszerelés").
            // Polish texts open quotes with „.
            // An optional lowercase game prefix ("gh-34") references an item of another game.
            let items = text.match(/[“„][^”()]+”[^”()]+\(\p{L}+ (?:[a-z]+-)?[\w ]+\)/gu) || [];
            items.forEach((item) => {
                const id = item.match(/\(\p{L}+ ((?:[a-z]+-)?[\w ]+)\)$/u)[1];
                list.put(isNaN(id) ? id : parseInt(id), item);
            });
        }

        return list;
    }

    ids(text) {
        return this.parse(text).keys();
    }
}
