// Keeps the Vue 2 event bus API ($on/$off/$once/$emit) that Vue 3 removed.
class EventBus {
    constructor() {
        this.listeners = new Map;
    }

    $on(event, callback) {
        [].concat(event).forEach(name => {
            if (!this.listeners.has(name)) {
                this.listeners.set(name, new Set);
            }
            this.listeners.get(name).add(callback);
        });
    }

    $once(event, callback) {
        const once = (...args) => {
            this.$off(event, once);
            return callback(...args);
        };
        this.$on(event, once);
    }

    $off(event, callback) {
        if (event === undefined) {
            this.listeners.clear();
            return;
        }

        [].concat(event).forEach(name => {
            callback ? this.listeners.get(name)?.delete(callback) : this.listeners.delete(name);
        });
    }

    // Like Vue 2, a failing listener is logged instead of breaking the emitter and the other listeners.
    $emit(event, ...args) {
        [...(this.listeners.get(event) || [])].forEach(callback => {
            try {
                Promise.resolve(callback(...args)).catch(error => console.error(error));
            } catch (error) {
                console.error(error);
            }
        });
    }
}

export default new EventBus;
