import store from "store/dist/store.modern";
import Helpers from "../services/Helpers";

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
                return value !== null && typeof value !== 'undefined' && value !== '' && (!Array.isArray(value) || value.length)
            })
            .all();
    },

    store() {
        app.campaignData[this.key()] = this.valuesToStore();
        const campaignData = _.clone(app.campaignData);
        campaignData[this.key()] = this.valuesToStore();
        store.set(app.campaignId, campaignData);
    },

    read() {
        const model = _.clone(app.campaignData[this.key()]);

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

                this[modelKey] = model[storeKey] ?? defaultValue;
            });
        }
    },

    delete() {
        // Tombstone instead of removing the key, so the server can tell a genuine delete from a stale/incomplete payload.
        app.campaignData[this.key()] = null;
        store.set(app.campaignId, app.campaignData);
    },
}
