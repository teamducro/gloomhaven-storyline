import Character from "../models/Character";
import {v4 as uuidv4} from 'uuid';
import GameData from "../services/GameData";
import SheetRepository from "./SheetRepository";

export default class CharacterRepository {

    get(game) {
        const characters = collect(this.gameData.characters(game));
        return this.checkHiddenCharacters(characters);
    }

    ids(game) {
        const order = this.gameData.characterOrder(game);
        return this.get().keys().toArray().sort((a, b) => {
            return order.indexOf(a) - order.indexOf(b);
        });
    }

    checkHiddenCharacters(characters) {
        const data = this.sheetRepository.data("gh");

        // Check Envelope X solution before Bladeswarm is available
        if (data?.xResult?.toLowerCase() !== 'bladeswarm') {
            characters.forget("BS");
        }

        // Hide characters from inactive games
        const games = _.uniq([app.game, ...app.enabledGames]);
        characters = characters.values().whereIn('game', games);

        return characters.keyBy('id');
    }

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
        character.delete();
        sheet.store();
    }

    get sheetRepository() {
        return this._sheetRepository || (this._sheetRepository = new SheetRepository());
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
}
