export const Unlock = Object.freeze({
    "calendar": "calendar",
    "puzzle": "puzzle",
    "random": "random",
    "event": "event",
    "personal": "personal",
    "job": "job",

    make(unlock) {
        const unlocks = collect(this.unlocks())
            .mapWithKeys((unlock) => {
                return [unlock.substr(0, 1), unlock];
            }).all();

        return unlocks[unlock];
    },

    unlocks() {
        return Object.getOwnPropertyNames(this);
    }
});
