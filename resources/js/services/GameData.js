import achievementsJson from '../achievements.json'
import scenariosJson from '../scenarios.json'
import scenariosJotlJson from '../scenarios-jotl.json'
import questsJson from '../quests.json'
import questsFCJson from '../quests-fc.json'
import questsJotlJson from '../quests-jotl.json'
import itemsJson from '../items.json'
import itemsJotlJson from '../items-jotl.json'
import charactersJson from '../characters.json'

export default class GameData {
    achievements(game) {
        switch (game) {
            case 'jotl':
                return []
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

    characterOrder(game) {
        switch (game) {
            default:
                return charactersJson.order
        }
    }

    characterNames(game) {
        switch (game) {
            default:
                return charactersJson.names
        }
    }

    characterPerks(game) {
        switch (game) {
            default:
                return charactersJson.perks
        }
    }

    _scenarioData(game) {
        switch (game) {
            case 'jotl':
                return scenariosJotlJson
            default:
                return scenariosJson
        }
    }

    quests(game) {
        switch (game) {
            case 'fc':
                return questsFCJson
            case 'jotl':
                return questsJotlJson
            default:
                return questsJson
        }
    }

    items(game) {
        switch (game) {
            case 'jotl':
                return itemsJotlJson
            default:
                return itemsJson
        }
    }

    map(game = 'gh') {
        let map = 'fc';

        // GH uses the FC map
        if (game !== 'gh') {
            map = game;
        }

        return {
            lowres: `/img/maps/${map}/lowres.jpg`,
            highres: `/img/maps/${map}/highres.jpg`
        }
    }

    scenarioStickerScale(game = 'gh') {
        if (game === 'gh' || game === 'fc') {
            return 0.79;
        }

        return 1;
    }

    storylineViewBox(game = 'gh') {
        switch (game) {
            case 'fc':
                return {
                    portrait: '0 0 560 600',
                    landscape: '0 -40 560 600'
                }
            case 'jotl':
                return {
                    portrait: '-100 0 500 500',
                    landscape: '-100 -70 500 500'
                }
            default:
                return {
                    portrait: '0 -70 420 1080',
                    landscape: '0 -40 610 700'
                }
        }
    }
}
