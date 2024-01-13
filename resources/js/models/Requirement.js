export const Requirement = Object.freeze({
    "rope": "rope",
    "boat": "boat",
    "sled": "sled",

    requirements() {
        const properties = Object.getOwnPropertyDescriptors(this)
        return Object.keys(properties).filter(key => typeof properties[key].value === 'string');
    },

    overlayId(requirement) {
        switch (requirement) {
            case this.boat: return 'A';
            case this.sled: return 'B';
            case this.rope: return 'C';
        }
    }
});
