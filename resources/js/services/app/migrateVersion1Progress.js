import store from "store/dist/store.modern";

export default function migrateVersion1Progress() {
    // No migrations needed
    if (!store.get('scenario-1')) {
        return;
    }

    const items = {...localStorage};

    // fetch old campaign progress.
    let local = {};
    for (const [key, value] of Object.entries(items)) {
        if (key.startsWith('scenario') || key.startsWith('achievement')) {
            local[key] = JSON.parse(value);
        }
    }

    // store campaign progress at new location.
    store.set('local', local);

    // remove old campaign progress.
    Object.keys(local).forEach(key => {
        store.remove(key);
    });
}
