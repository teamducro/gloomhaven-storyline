import achievementsJson from '../achievements.json'
import scenariosJson from '../scenarios.json'
import scenariosFCJson from '../scenarios-fc.json'
import questsJson from '../quests.json'
import questsFCJson from '../quests-fc.json'
import itemsJson from '../items.json'

export default class GameData {
    achievements(game) {
        switch (game) {
            case 'fc':
                return achievementsJson
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
            case 'fc':
                return scenariosFCJson
            default:
                return scenariosJson
        }
    }

    quests(game) {
        switch (game) {
            case 'fc':
                return questsFCJson.quests
            default:
                return questsJson.quests
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
        let map;

        if (game !== 'fc') {
            map = game;
        }

        return {
            lowres: `/img/maps/${map}-lowres.jpg`,
            highres: `/img/maps/${map}-highres.jpg`
        }
    }
}
