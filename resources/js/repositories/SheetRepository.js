import Sheet from "../models/Sheet";
import CampaignSheet from "../models/CampaignSheet";
import {Game} from "../models/Game";

export default class SheetRepository {

    make(game) {
        return game === Game.fh ? CampaignSheet.make(game) : Sheet.make(game);
    }

    data(game) {
        // During boot window.app is still the #app element, without campaign data
        return _.clone(app.campaignData?.[this.key(game)]);
    }

    // gh and gh2 are separate games, the campaign picks which one is played as Gloomhaven
    gloomhavenGame() {
        return this.data(Game.gh)?.edition === 2 ? Game.gh2 : Game.gh;
    }

    // The Gloomhaven editions whose classes the campaign offers
    gloomhavenClassGames() {
        return this.data(Game.gh)?.bothEditions ? [Game.gh, Game.gh2] : [this.gloomhavenGame()];
    }

    key(game) {
        switch (game) {
            case Game.gh:
            case Game.fc:
                return 'sheet';
            default:
                return 'sheet-' + game;
        }
    }

}
