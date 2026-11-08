export default class ItemTextParser {
    parse(text) {
        let list = collect({});

        if (text.includes('(') || text.includes('（')) {
            // The id itself may contain a space (e.g. crossover pack ids like "CA A"),
            // so only the leading "Item"/label word is a single token, in letters of any script ("Felszerelés", Thai combining marks).
            // Locales quote with “…”, „…” / „…“, «…» or 「…」, and CJK uses full-width parentheses without a space ("”（道具 34）").
            // An optional lowercase game prefix ("gh-34") references an item of another game.
            let items = text.match(/[“„«「][^“”»」()（）]+[”“»」][^“”„«»「」()（）]*[(（][\p{L}\p{M}]+ (?:[a-z]+-)?[\w ]+[)）]/gu) || [];
            items.forEach((item) => {
                const id = item.match(/[(（][\p{L}\p{M}]+ ((?:[a-z]+-)?[\w ]+)[)）]$/u)[1];
                list.put(isNaN(id) ? id : parseInt(id), item);
            });
        }

        return list;
    }

    ids(text) {
        return this.parse(text).keys();
    }
}
