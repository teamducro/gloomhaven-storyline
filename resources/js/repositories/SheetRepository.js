import Sheet from "../models/Sheet";

export default class SheetRepository {

    make(game) {
        switch (game) {
            default:
                return Sheet.make();
        }
    }

}
