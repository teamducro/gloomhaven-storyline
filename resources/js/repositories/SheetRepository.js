import Sheet from "../models/Sheet";

export default class SheetRepository {

    make(game) {
        return Sheet.make(game);
    }

    data(game) {
        return _.clone(app.campaignData[this.key(game)]);
    }

    key(game) {
        switch (game) {
            case 'gh':
            case 'fc':
                return 'sheet';
            default:
                return 'sheet-' + game;
        }
    }

}
