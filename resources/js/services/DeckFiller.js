const range = (from, to) => Array.from({length: to - from + 1}, (_, i) => from + i);

// Fills a numbered list so every id exists (false = not owned), then drops ids above `max`.
// spec: start (ids 1..start are true when the list is empty), last (1..last), ranges [[from, to]],
// ids, extra (further ids), max.
export default {
    fill(list, spec = {}) {
        const filled = {...list};

        if (spec.start && !Object.keys(filled).length) {
            range(1, spec.start).forEach(id => filled[id] = true);
        }

        const ids = [
            ...(spec.last ? range(1, spec.last) : []),
            ...(spec.ranges || []).flatMap(([from, to]) => range(from, to)),
            ...(spec.ids || []),
            ...(spec.extra || []),
        ];
        ids.forEach(id => filled[id] = filled[id] || false);

        if (spec.max === undefined) {
            return filled;
        }

        // Crossover packs (e.g. Mercenary Pack) use non-numeric ids like "AN1" that the range check doesn't apply to.
        return Object.fromEntries(Object.entries(filled).filter(([id]) => isNaN(id) || (id >= 0 && id <= spec.max)));
    },
    // Ids 0..count-1, for unlock lists that are index-keyed.
    fillUnlocks(list, spec) {
        const filled = {...list};
        for (let i = 0; i < spec.count; i++) {
            filled[i] = filled[i] || false;
        }

        return this.fill(filled, {max: spec.max});
    },
}
