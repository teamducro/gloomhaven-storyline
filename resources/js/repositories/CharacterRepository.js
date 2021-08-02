import Character from "../models/Character";
import {v4 as uuidv4} from 'uuid';

export default class CharacterRepository {

    partyHasCharacter(sheet, id) {
        for (const uuid in sheet.characters) {
            if (sheet.characters[uuid].id === id) {
                return true;
            }
        }

        return false;
    }

    createCharacter(sheet, id) {
        if (!this.partyHasCharacter(sheet, id)) {
            const uuid = uuidv4();
            const character = Character.make(uuid, sheet.game, id);
            sheet.characters[uuid] = character;
            sheet.store();
            character.store();

            return character;
        }
    }

    archiveCharacter(sheet, character) {
        if (character.uuid in sheet.characters && !(character.uuid in sheet.archivedCharacters)) {
            sheet.archivedCharacters[character.uuid] = {...character}
            delete sheet.characters[character.uuid];
            sheet.store();
        }
    }

    restoreCharacter(sheet, character) {
        if (character.uuid in sheet.archivedCharacters && !(character.uuid in sheet.characters)) {
            sheet.characters[character.uuid] = {...character}
            delete sheet.archivedCharacters[character.uuid];
            sheet.store();
        }
    }

    removeCharacter(sheet, character) {
        delete sheet.characters[character.uuid];
        delete sheet.archivedCharacters[character.uuid];
        sheet.store();
    }
}
