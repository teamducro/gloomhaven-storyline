// The file of this build; its hash changes with every deploy.
const build = import.meta.url;
let reloading = false;

// A lazy chunk failed to load, likely removed by a deploy: reload to get the new build.
// Returns true when the error is handled and shouldn't be reported: a reload is under way, or we're offline.
// Reloads at most once per build per tab, so a chunk that stays missing is reported instead of reloading forever.
export default function reloadForNewBuild() {
    if (reloading || navigator.onLine === false) {
        return true;
    }

    if (sessionStorage.getItem('reloadedForNewBuild') === build) {
        return false;
    }

    sessionStorage.setItem('reloadedForNewBuild', build);
    reloading = true;
    location.reload();
    return true;
}
