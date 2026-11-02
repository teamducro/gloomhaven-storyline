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
            el.addEventListener('click', () => navigator.clipboard?.writeText(el._clipboardValue));
        },
        updated(el, binding) {
            el._clipboardValue = binding.value;
        },
    });

    app.config.globalProperties.$scrollTo = selector => {
        document.querySelector(selector)?.scrollIntoView({behavior: 'smooth'});
    };
}
