import Sheet from "../models/Sheet";
import CampaignSheet from "../models/CampaignSheet";
import {Game} from "../models/Game";

export default class SheetRepository {

    make(game) {
        return game === Game.fh ? CampaignSheet.make(game) : Sheet.make(game);
    }

    data(game) {
        return _.clone(app.campaignData[this.key(game)]);
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
