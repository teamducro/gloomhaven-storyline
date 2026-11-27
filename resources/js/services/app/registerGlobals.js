import bus from "../EventBus";

const listeners = new WeakMap;

// Replaces vue-clipboard2 (v-clipboard:copy) and vue-scrollto ($scrollTo), and keeps Vue 2 behaviour.
export default function registerGlobals(app) {
    // Vue 2 logged component errors; Vue 3's dev build rethrows them (e.g. offline API calls in async hooks).
    app.config.errorHandler = (error, instance, info) => console.error(error, info);

    // Inkscape metadata tags (sodipodi:*, inkscape:*) in the inline SVG templates.
    app.config.compilerOptions.isCustomElement = tag => tag.includes(':');
    // Same Vue 2 whitespace handling as the SFC templates (see vite.config.mjs).
    app.config.compilerOptions.whitespace = 'preserve';

    app.directive('clipboard', {
        mounted(el, binding) {
            el._clipboardValue = binding.value;
            el.addEventListener('click', () => copy(el._clipboardValue)
                .catch(() => bus.$emit('toast', binding.instance.$t('Could not copy'), false)));
        },
        updated(el, binding) {
            el._clipboardValue = binding.value;
        },
    });

    app.config.globalProperties.$scrollTo = selector => {
        document.querySelector(selector)?.scrollIntoView({behavior: 'smooth'});
    };

    // Bus subscription that ends with the component, so no $off is needed.
    app.config.globalProperties.$listen = function (event, callback) {
        bus.$on(event, callback);
        listeners.set(this, [...(listeners.get(this) || []), [event, callback]]);
    };
    app.mixin({
        beforeUnmount() {
            listeners.get(this)?.forEach(([event, callback]) => bus.$off(event, callback));
        },
    });
}

// The Clipboard API is missing in insecure contexts and can be blocked by a permissions policy.
async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) {
            throw new Error('Could not copy');
        }
    }
}
