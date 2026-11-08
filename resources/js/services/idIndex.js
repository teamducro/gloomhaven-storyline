// Keyed by the items array: a refetch (new array) builds a new index, but an in-place push/splice isn't seen.
const indexes = new WeakMap();

// Validators look models up thousands of times per run; a linear scan through the reactive collection dominated it.
export default function idIndex(items) {
    if (!indexes.has(items)) {
        const index = new Map();
        items.forEach(model => index.has(model.id) || index.set(model.id, model));
        indexes.set(items, index);
    }

    return indexes.get(items);
}
