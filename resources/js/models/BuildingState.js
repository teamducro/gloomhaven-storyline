export const BuildingState = Object.freeze({
    "locked": "locked",
    "available": "available",
    "built": "built",
    "damaged": "damaged",
    "wrecked": "wrecked",

    states() {
        return Object.getOwnPropertyNames(this);
    }
});
