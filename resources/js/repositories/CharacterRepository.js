import Character from "../models/Character";
import GameData from "../services/GameData";

export default class CharacterRepository {

    createCharacter(sheet, id) {
        const character = Character.make(id, sheet.game);
        sheet.characters[id] = character;
        sheet.store();
        character.store();
    }
}
