import Sheet from "../models/Sheet";
import Character from "../models/Character";

export default class SheetRepository {

    make(game) {
        switch (game) {
            default:
                return Sheet.make();
        }
    }

}
