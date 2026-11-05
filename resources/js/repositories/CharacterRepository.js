import Character from "../models/Character";
import {v4 as uuidv4} from 'uuid';
import GameData from "../services/GameData";
import SheetRepository from "./SheetRepository";
import {Game} from "../models/Game";
import PersonalQuest from "../models/PersonalQuest";
import PersonalQuestValidator from "../validators/PersonalQuestValidator";

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

        // Hide characters from inactive games. Only classes of the campaign's Gloomhaven edition are playable, in every game.
        // Turning off gh hides both editions.
        const gloomhavenGame = this.sheetRepository.gloomhavenGame();
        const gloomhavenEnabled = [Game.gh, Game.gh2].includes(app.game) || app.enabledGames.includes(Game.gh);
        const games = _.without(
            _.uniq([app.game, ...app.enabledGames, ...(gloomhavenEnabled ? [gloomhavenGame] : [])]),
            gloomhavenGame === Game.gh2 ? Game.gh : Game.gh2,
            ...(gloomhavenEnabled ? [] : [Game.gh2])
        );
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

    // Pro campaigns archive a retired or abandoned character, it can be restored or removed later.
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

    // Retiring adds the class's retirement events and keeps its quest's scenarios.
    // Pro campaigns archive the character, local campaigns remove it.
    retireCharacter(sheet, character, archive) {
        this.applyRetirement(sheet, character);
        this.archiveOrRemove(sheet, character, archive);
    }

    // Abandoning adds no events and locks the scenarios its personal quest unlocked again; completed ones stay (FAQ 3.2).
    abandonCharacter(sheet, character, archive) {
        if (character.quest instanceof PersonalQuest) {
            new PersonalQuestValidator().lockScenarios(character.quest, sheet);
            character.quest.resetProgress();
            character.store();
        }
        this.archiveOrRemove(sheet, character, archive);
    }

    removeCharacter(sheet, character) {
        delete sheet.characters[character.uuid];
        delete sheet.archivedCharacters[character.uuid];
        character.delete();
        sheet.store();
    }

    archiveOrRemove(sheet, character, archive) {
        if (archive) {
            this.archiveCharacter(sheet, character);
        } else {
            this.removeCharacter(sheet, character);
        }
    }

    applyRetirement(sheet, character) {
        sheet.addClassEvents(character.id, 'retire');
        // GH2e campaign sheet unlock: the first retirement reads section 68.4.
        if (sheet.game === Game.gh2) {
            sheet.unlocks[this.gameData.sectionsGh2().firstRetirementUnlock] = true;
        }
    }

    get sheetRepository() {
        return this._sheetRepository || (this._sheetRepository = new SheetRepository());
    }

    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
}
