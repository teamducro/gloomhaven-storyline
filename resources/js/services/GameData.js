import achievementsJson from '../achievements.json'
import scenariosJson from '../scenarios.json'
import scenariosJotlJson from '../scenarios-jotl.json'
import scenariosCsJson from '../scenarios-cs.json'
import questsJson from '../quests.json'
import questsFcJson from '../quests-fc.json'
import questsJotlJson from '../quests-jotl.json'
import questsCsJson from '../quests-cs.json'
import personalQuestsJson from '../personal-quests.json'
import itemsJson from '../items.json'
import itemsJotlJson from '../items-jotl.json'
import itemsCsJson from '../items-cs.json'
import abilitiesJson from '../abilities.json'
import abilitiesFcJson from '../abilities-fc.json'
import abilitiesJotlJson from '../abilities-jotl.json'
import abilitiesCsJson from '../abilities-cs.json'
import charactersJson from '../characters.json'

export default class GameData {
    achievements(game) {
        switch (game) {
            case 'jotl':
            case 'cs':
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

    characters(game) {
        switch (game) {
            default:
                return _.clone(charactersJson.characters)
        }
    }

    characterOrder(game) {
        switch (game) {
            default:
                return charactersJson.order
        }
    }

    _scenarioData(game) {
        switch (game) {
            case 'jotl':
                return scenariosJotlJson
            case 'cs':
                return scenariosCsJson
            default:
                return scenariosJson
        }
    }

    quests(game) {
        switch (game) {
            case 'fc':
                return questsFcJson
            case 'jotl':
                return questsJotlJson
            case 'cs':
                return questsCsJson
            default:
                return questsJson
        }
    }

    items(game) {
        switch (game) {
            case 'jotl':
                return itemsJotlJson
            case 'cs':
                return itemsCsJson
            default:
                return itemsJson
        }
    }

    abilities(game) {
        switch (game) {
            case 'jotl':
                return abilitiesJotlJson
            case 'fc':
                return abilitiesFcJson
            case 'cs':
                return abilitiesCsJson
            default:
                return abilitiesJson
        }
    }

    personalQuests(game) {
        switch (game) {
            default:
                return personalQuestsJson
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

    mapSettings(game = 'gh') {
        if (game === 'gh' || game === 'fc') {
            return {
                stickerScale: 0.79,
                yOffset: 184,
                width: 2606,
                height: 2155
            };
        }

        return {
            stickerScale: 1,
            yOffset: 0,
            width: 2486,
            height: 1905
        };
    }

    mapYOffset(game = 'gh') {
        if (game === 'gh' || game === 'fc') {
            return 184;
        }

        return 0;
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
