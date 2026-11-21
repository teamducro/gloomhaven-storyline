// A lazy chunk failed to load, likely removed by a deploy: reload to get the new build, at most once a minute to
// avoid a reload loop when the chunk is missing for another reason.
export default function reloadForNewBuild() {
    const last = Number(sessionStorage.getItem('reloadedForNewBuild'));
    if (Date.now() - last < 60000) {
        return false;
    }

    sessionStorage.setItem('reloadedForNewBuild', Date.now());
    location.reload();
    return true;
}
