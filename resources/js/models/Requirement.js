export const Requirement = Object.freeze({
    "rope": "rope",
    "boat": "boat",
    "sled": "sled",
    "calendar": "calendar",
    "puzzle": "puzzle",

    requirements() {
        const properties = Object.getOwnPropertyDescriptors(this)
        return Object.keys(properties).filter(key => typeof properties[key].value === 'string');
    },

    check(requirement) {
        return this.requirements().includes(requirement);
    },

    overlayId(requirement) {
        switch (requirement) {
            case this.boat: return 'A';
            case this.sled: return 'B';
            case this.rope: return 'C';
            default: return '';
        }
    },

    manuallyUnlock(requirement) {
        return [
            this.calendar,
            this.puzzle
        ].includes(requirement);
    },

    page(requirement) {
        switch (requirement) {
            case this.calendar: return '/party';
            default: return '/buildings';
        }
    }
});
