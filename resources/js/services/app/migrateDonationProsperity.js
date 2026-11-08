import store from "store/dist/store.modern";
import SheetCalculations from "../SheetCalculations";

// Older campaigns ticked donation boxes by hand, so move them out of prosperityIndex to keep the total unchanged.
// Marked in a top-level key: older clients rebuild the sheet without the fields they don't know, but keep other keys.
// Runs on load, before any sync copies the campaign, so the marker always travels with the migrated sheet.
export default function migrateDonationProsperity(campaignId, campaignData) {
    let migrated = false;

    for (const [key, sheet] of Object.entries(campaignData)) {
        const marker = `migrated-donations-${key}`;
        if ((key !== 'sheet' && !key.startsWith('sheet-')) || campaignData[marker]) {
            continue;
        }

        const game = key === 'sheet' ? 'gh' : key.replace('sheet-', '');
        const donationChecks = SheetCalculations.methods.calculateDonationProsperity(sheet?.donations || 0, game);
        // autoDonationProsperity: the in-sheet marker used before.
        if (sheet && !sheet.autoDonationProsperity && donationChecks) {
            campaignData[key] = {...sheet, prosperityIndex: Math.max(1, (sheet.prosperityIndex || 1) - donationChecks)};
        }
        campaignData[marker] = true;
        migrated = true;
    }

    if (migrated) {
        store.set(campaignId, campaignData);
    }

    return campaignData;
}
