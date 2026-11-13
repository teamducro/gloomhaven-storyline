import Sheet from "../../models/Sheet";
import {Game} from "../../models/Game";

// Runs on load, after app.campaignData is set: building a sheet before then would migrate, and store, an empty campaign.
export default function migrateSheets(campaignData) {
    // Only GH2e campaigns have a GH2e sheet, so an older client rewrote the Gloomhaven sheet without the edition it doesn't know.
    if (campaignData.sheet && !campaignData.sheet.edition && campaignData['sheet-gh2']) {
        const sheet = new Sheet({game: Game.gh});
        sheet.edition = 2;
        sheet.store();
    }

    Object.keys(campaignData)
        .filter(key => (key === 'sheet' || key.startsWith('sheet-')) && campaignData[key])
        .map(key => key === 'sheet' ? Game.gh : key.replace('sheet-', ''))
        .filter(game => game !== Game.fh && Object.values(Game).includes(game))
        .forEach(game => new Sheet({game}).migrate());
}
