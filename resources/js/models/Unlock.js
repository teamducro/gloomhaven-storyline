export const Unlock = Object.freeze({
    "calendar": "calendar",
    "puzzle": "puzzle",
    "random": "random",
    "event": "event",
    "personal": "personal",
    "job": "job",

    unlocks() {
        const properties = Object.getOwnPropertyDescriptors(this)
        return Object.keys(properties).filter(key => typeof properties[key].value === 'string');
    }
});
