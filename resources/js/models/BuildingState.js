export const BuildingState = Object.freeze({
    "locked": "locked",
    "available": "available",
    "built": "built",
    "damaged": "damaged",
    "wrecked": "wrecked",

    states() {
        const properties = Object.getOwnPropertyDescriptors(this)
        return Object.keys(properties).filter(key => typeof properties[key].value === 'string');
    },
});
