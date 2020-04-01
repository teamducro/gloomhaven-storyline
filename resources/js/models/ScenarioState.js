export const ScenarioState = Object.freeze({
    "hidden": "hidden",
    "incomplete": "incomplete",
    "complete": "complete",
    "blocked": "blocked",
    "required": "required",

    make(state) {
        const states = collect(Object.getOwnPropertyNames(this))
            .mapWithKeys((state) => {
                return [state.substr(0, 1), state];
            }).all();

        return states[state];
    }
});
