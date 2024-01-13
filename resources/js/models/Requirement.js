export const Requirement = Object.freeze({
    "rope": "rope",
    "boat": "boat",
    "sled": "sled",

    make(requirement) {
        const requirements = collect(this.requirements())
            .mapWithKeys((requirement) => {
                return [requirement.substr(0, 1), requirement];
            }).all();

        return requirements[requirement];
    },

    requirements() {
        return Object.getOwnPropertyNames(this);
    }
});
