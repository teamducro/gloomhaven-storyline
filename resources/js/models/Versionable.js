import md5 from "js-md5";

// Versionable models, can be applied on storable models.
export default {
    increaseVersion() {
        this.version = (this.version || 0) + 1;
        this.hash = this.makeHash();
        this.parentStore();
    },

    hasChanged() {
        return this.hash !== this.makeHash();
    },

    makeHash() {
        const data = this.valuesToStore();
        delete data.version;
        delete data.hash;
        return md5(JSON.stringify(data));
    },

    store() {
        // Hack to make sure the version is updated on other instances of the same model
        this.version = app.campaignData[this.key()]?.version;
        this.hash = app.campaignData[this.key()]?.hash;
        this.parentStore();
    }
}
