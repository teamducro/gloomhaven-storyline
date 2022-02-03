export default class ItemTextParser {
    parse(text) {
        let list = collect({});

        if (text.includes('(Item')) {
            let items = text.match(/(“[\w\s-]+”[\w\s]+\(Item [\d]+\))/g);
            items.forEach((item) => {
                const id = parseInt(item.replace(/\D/g, ''));
                list.put(id, item);
            });
        }

        return list;
    }

    ids(text) {
        return this.parse(text).keys().map((id) => parseInt(id));
    }
}
