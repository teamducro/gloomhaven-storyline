export default function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Some browsers resolve without a registration or reject; the app works without a worker.
            navigator.serviceWorker.register('/service-worker.js').catch(() => {});
        });
    }
}
