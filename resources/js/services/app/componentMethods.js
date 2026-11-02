import bus from "../EventBus";

// Runs a component's methods without mounting it (replaces the Vue 2 `new (Vue.extend(Component))` trick).
export default function componentMethods(component) {
    const context = {$bus: bus};
    Object.assign(context, component.data.call(context));
    Object.entries(component.methods).forEach(([name, method]) => context[name] = method.bind(context));

    return context;
}
