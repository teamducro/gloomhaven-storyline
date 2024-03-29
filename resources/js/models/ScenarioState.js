export const ScenarioState = Object.freeze({
    "hidden": "hidden",
    "incomplete": "incomplete",
    "complete": "complete",
    "blocked": "blocked",
    "required": "required",

    make(state) {
        const states = collect(this.states())
            .mapWithKeys((state) => {
                return [state.substr(0, 1), state];
            }).all();

        return states[state];
    },

    states() {
        const properties = Object.getOwnPropertyDescriptors(this)
        return Object.keys(properties).filter(key => typeof properties[key].value === 'string');
    },
});
