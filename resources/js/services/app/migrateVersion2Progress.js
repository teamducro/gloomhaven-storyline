import store from "store/dist/store.modern";

export default function migrateVersion2Progress(campaignData) {
    // No migrations needed
    if (!campaignData['scenario-1']) {
        return campaignData;
    }

    for (const [key, value] of Object.entries(campaignData)) {
        // migrate scenario keys
        if (key.startsWith('scenario') && key.length <= 12) {
            const id = key.replace('scenario-', '');
            const game = id <= 95 ? 'gh' : 'fc';
            // add new scenario key, includes the game code
            campaignData[`scenario-${game}-${id}`] = value;
            // remove old key
            delete campaignData[key];
        }
    }

    return campaignData;
}
