import store from "store/dist/store.modern";

export default {

    valuesToStore() {
        return collect(this.fieldsToStore || {})
            .map((modelKey) => {
                if (typeof modelKey === 'object') {
                    modelKey = Object.keys(modelKey)[0];
                }
                return this[modelKey];
            })
            .sortKeys()
            .filter(value => {
                return value !== null && value !== '' && (!Array.isArray(value) || value.length)
            })
            .all();
    },

    store() {
        app.campaignData[this.key()] = this.valuesToStore();
        store.set(app.campaignId, app.campaignData);
    },

    read() {
        let model = app.campaignData[this.key()];

        if (model) {
            const fieldsToStore = collect(this.fieldsToStore || {});
            fieldsToStore.each((modelKey, storeKey) => {
                let defaultValue = undefined;
                // support for default values from local storage
                if (typeof modelKey === 'object') {
                    const key = Object.keys(modelKey)[0];
                    defaultValue = modelKey[key];
                    modelKey = key;
                }
                this[modelKey] = model[storeKey] || defaultValue;
            });
        }
    }
}
