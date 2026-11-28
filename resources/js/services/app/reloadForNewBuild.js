// The file of this build; its hash changes with every deploy.
const build = import.meta.url;
let reloading = false;
const reload = () => location.reload();

// A lazy chunk failed to load, likely removed by a deploy: reload to get the new build.
// Returns true when the error is handled and shouldn't be reported: a reload is under way, or we're offline.
// Reloads at most once per build per tab, so a chunk that stays missing is reported instead of reloading forever.
export default function reloadForNewBuild() {
    if (reloading) {
        return true;
    }
    if (navigator.onLine === false) {
        // The browser may keep the failed import, so reload once back online (same function: added once)
        window.addEventListener('online', reload, {once: true});
        return true;
    }

    if (sessionStorage.getItem('reloadedForNewBuild') === build) {
        return false;
    }

    sessionStorage.setItem('reloadedForNewBuild', build);
    reloading = true;
    reload();
    return true;
}
