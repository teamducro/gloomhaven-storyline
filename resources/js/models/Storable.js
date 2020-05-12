import store from "store/dist/store.modern";

export default {
    store() {
        const valuesToStore = collect(this.fieldsToStore || [])
            .map((modelKey) => {
                return this[modelKey];
            }).all();
        store.set(this.key(), valuesToStore);
    },

    read() {
        let model = store.get(this.key());
        if (model) {
            const fieldsToStore = collect(this.fieldsToStore || []);
            fieldsToStore.each((modelKey, storeKey) => {
                this[modelKey] = model[storeKey];
            });
        }
    }
}
