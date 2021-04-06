import achievementsJson from '../achievements.json'
import scenariosJson from '../scenarios.json'
import questsJson from '../quests.json'
import itemsJson from '../items.json'

export default class GameData {
    achievements(game) {
        switch (game) {
            default:
                return achievementsJson
        }
    }

    scenarios(game) {
        return this._scenarioData(game).scenarios
    }

    regions(game) {
        return this._scenarioData(game).regions
    }

    chapters(game) {
        return this._scenarioData(game).chapters
    }

    _scenarioData(game) {
        switch (game) {
            default:
                return scenariosJson
        }
    }

    quests(game) {
        switch (game) {
            default:
                return questsJson
        }
    }

    items(game) {
        switch (game) {
            case 'fc':
                return itemsJson
            default:
                return itemsJson
        }
    }

    map(game = 'gh') {
        let map = 'fc';

        if (game !== 'gh') {
            map = game;
        }

        return {
            lowres: `/img/maps/${map}-lowres.jpg`,
            highres: `/img/maps/${map}-highres.jpg`
        }
    }

    scenarioStickerScale(game = 'gh') {
        if (game === 'gh' || game === 'fc') {
            return 0.79;
        }

        return 1;
    }
}
