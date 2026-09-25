import achievementsJson from '../achievements.json'
import achievementsFhJson from '../achievements-fh.json'
import scenariosJson from '../scenarios.json'
import scenariosFhJson from '../scenarios-fh.json'
import scenariosJotlJson from '../scenarios-jotl.json'
import scenariosCsJson from '../scenarios-cs.json'
import scenariosMpJson from '../scenarios-mp.json'
import questsJson from '../quests.json'
import questsFcJson from '../quests-fc.json'
import questsJotlJson from '../quests-jotl.json'
import questsFhJson from '../quests-fh.json'
import questsCsJson from '../quests-cs.json'
import personalQuestsJson from '../personal-quests.json'
import personalQuestsCsJson from '../personal-quests-cs.json'
import personalQuestsFhJson from '../personal-quests-fh.json'
import itemsJson from '../items.json'
import itemsJotlJson from '../items-jotl.json'
import itemsCsJson from '../items-cs.json'
import itemsFhJson from '../items-fh.json'
import itemsMpJson from '../items-mp.json'
import abilitiesJson from '../abilities.json'
import abilitiesFcJson from '../abilities-fc.json'
import abilitiesJotlJson from '../abilities-jotl.json'
import abilitiesCsJson from '../abilities-cs.json'
import abilitiesFhJson from '../abilities-fh.json'
import abilitiesMpJson from '../abilities-mp.json'
import charactersJson from '../characters.json'
import attackModifierDecksJson from '../attack-modifier-decks.json'
import townGuardFhJson from '../town-guard-fh.json'
import alchemyFhJson from '../alchemy-fh.json'
import {Game} from "../models/Game";
import store from "store/dist/store.modern";

export default class GameData {
    // Crossover packs are not selectable as the main/active game, only as add-on content.
    validate(game) {
        return this.games().includes(game) && !this.crossover().includes(game)
    }

    games() {
        return Object.getOwnPropertyNames(Game)
    }

    beta() {
        return []
    }

    purchasable() {
        return [Game.gh, Game.fh]
    }

    free() {
        return this.games().filter(game => !this.purchasable().includes(game))
    }

    // Crossover packs are not standalone games: their characters and solo
    // scenarios are merged into whichever game is actually being played.
    crossoverData() {
        return {
            [Game.mp]: {
                scenarios: scenariosMpJson.scenarios,
                items: itemsMpJson
            }
        }
    }

    crossover() {
        return Object.keys(this.crossoverData())
    }

    enabledCrossovers() {
        const enabled = store.get('gamesEnabled', {})
        return this.crossover().filter(game => enabled[game] !== false)
    }

    achievements(game) {
        switch (game) {
            case Game.jotl:
                return []
            case Game.fh:
                return achievementsFhJson
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

    overlays(game) {
        return this._scenarioData(game).overlays || []
    }

    buildings(game) {
        return this._scenarioData(game).buildings || []
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
        const data = this._baseScenarioData(game)

        if (this.crossover().includes(game)) {
            return data
        }

        // Keep each scenario's own `game` (e.g. "mp") rather than retagging it to the
        // base game: translations are keyed by game-id, so retagging would orphan them.
        const crossoverData = this.crossoverData()
        const extraScenarios = this.enabledCrossovers().flatMap((crossoverGame) => {
            return crossoverData[crossoverGame].scenarios
        })

        if (!extraScenarios.length) {
            return data
        }

        return {...data, scenarios: [...data.scenarios, ...extraScenarios]}
    }

    _baseScenarioData(game) {
        switch (game) {
            case Game.fh:
                return scenariosFhJson
            case Game.jotl:
                return scenariosJotlJson
            case Game.cs:
                return scenariosCsJson
            case Game.mp:
                return scenariosMpJson
            default:
                return scenariosJson
        }
    }

    quests(game) {
        switch (game) {
            case Game.gh:
                return questsJson
            case Game.jotl:
                return questsJotlJson
            case Game.fh:
                return questsFhJson
            case Game.fc:
                return questsFcJson
            case Game.cs:
                return questsCsJson
            default:
                return []
        }
    }

    items(game) {
        const data = this._baseItems(game)

        if (this.crossover().includes(game)) {
            return data
        }

        const crossoverData = this.crossoverData()
        const extraItems = this.enabledCrossovers().flatMap((crossoverGame) => crossoverData[crossoverGame].items)

        return extraItems.length ? [...data, ...extraItems] : data
    }

    _baseItems(game) {
        switch (game) {
            case Game.jotl:
                return itemsJotlJson
            case Game.cs:
                return itemsCsJson
            case Game.fh:
                return itemsFhJson
            case Game.mp:
                return itemsMpJson
            // FC uses GH items
            default:
                return itemsJson
        }
    }

    abilities(game) {
        switch (game) {
            case Game.jotl:
                return abilitiesJotlJson
            case Game.fc:
                return abilitiesFcJson
            case Game.cs:
                return abilitiesCsJson
            case Game.fh:
                return abilitiesFhJson
            case Game.mp:
                return abilitiesMpJson
            default:
                return abilitiesJson
        }
    }

    personalQuests(game) {
        switch (game) {
            case Game.jotl:
                return []
            case Game.cs:
                return personalQuestsCsJson
            case Game.fh:
                return personalQuestsFhJson
            default:
                return personalQuestsJson
        }
    }

    attackModifierDeck() {
        return attackModifierDecksJson
    }

    townGuard(game) {
        switch (game) {
            case Game.fh:
                return townGuardFhJson
            default:
                return {};
        }
    }

    alchemy(game) {
        switch (game) {
            case Game.fh:
                return alchemyFhJson
            default:
                return [];
        }
    }

    map(game = Game.gh) {
        let map = Game.fc;

        // GH uses the FC map
        if (game !== Game.gh) {
            map = game;
        }

        // Games that do not support a map
        if ([Game.cs].includes(map)) {
            return null;
        }

        return {
            lowres: `/img/maps/${map}/lowres.jpg`,
            highres: `/img/maps/${map}/highres.jpg`
        }
    }

    mapSettings(game = Game.gh) {
        if (game === Game.gh || game === Game.fc) {
            return {
                stickerScale: 0.79,
                yOffset: 184,
                width: 2606,
                height: 2155
            };
        } else if (game == Game.fh) {
            return {
                stickerScale: 0.7,
                yOffset: 0,
                width: 2500,
                height: 3159
            };
        }

        return {
            stickerScale: 1,
            yOffset: 0,
            width: 2486,
            height: 1905
        };
    }

    mapYOffset(game = Game.gh) {
        if (game === Game.gh || game === Game.fc) {
            return 184;
        }

        return 0;
    }

    storylineViewBox(game = Game.gh) {
        switch (game) {
            case Game.fc:
                return {
                    portrait: '0 0 560 600',
                    landscape: '0 -40 560 600'
                }
            case Game.jotl:
                return {
                    portrait: '-100 0 500 500',
                    landscape: '-100 -70 500 500'
                }
            case Game.cs:
                return {
                    portrait: '0 0 370 540',
                    landscape: '0 -40 530 370'
                }
            case Game.fh:
                return {
                    portrait: '-20 -40 718 691',
                    landscape: '-20 -40 718 691'
                }
            default:
                return {
                    portrait: '0 -70 420 1080',
                    landscape: '0 -40 610 700'
                }
        }
    }
}
