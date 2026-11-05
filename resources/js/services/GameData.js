import ghJson from '../games/gh.json'
import gh2Json from '../games/gh2.json'
import fhJson from '../games/fh.json'
import fcJson from '../games/fc.json'
import jotlJson from '../games/jotl.json'
import csJson from '../games/cs.json'
import mpJson from '../games/mp.json'
import cqJson from '../games/cq.json'
import {Game} from "../models/Game";
import store from "store/dist/store.modern";

const files = {
    [Game.gh]: ghJson,
    [Game.gh2]: gh2Json,
    [Game.fh]: fhJson,
    [Game.fc]: fcJson,
    [Game.jotl]: jotlJson,
    [Game.cs]: csJson,
    [Game.mp]: mpJson,
    [Game.cq]: cqJson,
}

// Merge order of the lists that span all games; keeps the historical global order.
const mergeOrder = [Game.gh, Game.fc, Game.jotl, Game.cs, Game.fh, Game.mp, Game.gh2].map(game => files[game])

const allCharacters = Object.assign({}, ...mergeOrder.map(file => file.characters))
const allCharacterOrder = mergeOrder.flatMap(file => file.characterOrder)
const allAttackModifierDecks = Object.assign({}, ...mergeOrder.map(file => file.attackModifierDecks))
// GH, FC, CS and MP share one list: the GH achievements, then the CS Party achievements.
const ghFamilyAchievements = [...files.gh.achievements, ...files.cs.achievements]

export default class GameData {
    // Crossover packs are not selectable as the main/active game, only as add-on content.
    validate(game) {
        return this.games().includes(game) && !this.crossover().includes(game)
    }

    games() {
        return Object.getOwnPropertyNames(Game)
    }

    purchasable() {
        return [Game.gh, Game.fh]
    }

    // Games without their own product: buying the mapped game unlocks them too.
    includedIn() {
        return {[Game.gh2]: Game.gh}
    }

    // The game whose purchase gives access to `game`.
    accessGame(game) {
        return this.includedIn()[game] || game
    }

    free() {
        return this.games().filter(game => !this.purchasable().includes(this.accessGame(game)))
    }

    // Crossover packs are not standalone games: their characters and solo
    // scenarios are merged into whichever game is actually being played.
    crossoverData() {
        return {
            [Game.mp]: {
                scenarios: files[Game.mp].scenarios,
                items: files[Game.mp].items
            },
            [Game.cq]: {
                scenarios: files[Game.cq].scenarios,
                items: files[Game.cq].items
            }
        }
    }

    crossover() {
        return Object.keys(this.crossoverData())
    }

    enabledCrossovers() {
        const enabled = store.get('gamesEnabled', {})
        return this.crossover().filter(game => game in enabled ? enabled[game] : this.enabledByDefault(game))
    }

    // Crossover packs start off, except MP for campaigns that already play one of its classes.
    enabledByDefault(game) {
        if (game === Game.mp) {
            const campaign = store.get(store.get('campaignId') || 'local') || {}
            const mpClasses = files[Game.mp].characterOrder

            return Object.entries(campaign)
                .some(([key, value]) => key.startsWith('character-') && mpClasses.includes(value?.id))
        }

        return !this.crossover().includes(game)
    }

    // Games whose personal quest deck the ConQuests cards can be shuffled into.
    conquestsGames() {
        return [Game.gh, Game.fc, Game.gh2, Game.fh]
    }

    achievements(game) {
        if ([Game.jotl, Game.fh, Game.gh2].includes(game)) {
            return files[game].achievements
        }

        return ghFamilyAchievements
    }

    // Keep each scenario's own `game` (e.g. "mp") rather than retagging it to the
    // base game: translations are keyed by game-id, so retagging would orphan them.
    scenarios(game) {
        const scenarios = this._playable(game).scenarios

        if (this.crossover().includes(game)) {
            return scenarios
        }

        const crossoverData = this.crossoverData()
        const extraScenarios = this.enabledCrossovers().flatMap((crossoverGame) => crossoverData[crossoverGame].scenarios)

        return extraScenarios.length ? [...scenarios, ...extraScenarios] : scenarios
    }

    regions(game) {
        return this._playable(game).regions
    }

    chapters(game) {
        return this._playable(game).chapters
    }

    overlays(game) {
        return this._playable(game).overlays
    }

    buildings(game) {
        return this._playable(game).buildings
    }

    characters() {
        return _.clone(allCharacters)
    }

    characterOrder() {
        return allCharacterOrder
    }

    quests(game) {
        return files[game]?.quests || []
    }

    items(game) {
        const items = this._playable(game).items

        if (this.crossover().includes(game)) {
            return items
        }

        const crossoverData = this.crossoverData()
        const extraItems = this.enabledCrossovers().flatMap((crossoverGame) => crossoverData[crossoverGame].items)

        return extraItems.length ? [...items, ...extraItems] : items
    }

    abilities(game) {
        return this._file(game).abilities
    }

    personalQuests(game) {
        return [Game.fc, Game.mp].includes(game) ? files[Game.gh].personalQuests : this._file(game).personalQuests
    }

    events(game) {
        return files[game]?.events || {}
    }

    // Class id => {unlock, retire} event lists; the caller maps games that share a list (fc uses gh).
    classEvents(game) {
        return files[game]?.classEvents || {}
    }

    // Starters are the classes in a group other than `<game>_locked` / `<game>_addon`; FC adds the GH starters.
    startingClasses(game) {
        const startersOf = (origin) => Object.values(this.characters())
            .filter(character => character.game === origin
                && (character.starting_group || []).some(group => !/_(locked|addon)$/.test(group)))
            .map(character => character.id)

        const own = this.crossover().includes(game) ? [] : startersOf(game)

        if (game === Game.fc) {
            return [...own, ...startersOf(Game.gh)]
        }

        return own.length ? own : startersOf(Game.gh)
    }

    decks(game) {
        return this._ownOrGh(game, 'decks')
    }

    prosperity(game) {
        return this._ownOrGh(game, 'prosperity')
    }

    shop(game) {
        return files[game]?.shop || {}
    }

    // A game's own value wins (even null), otherwise the GH one.
    campaignRule(game, key) {
        const rules = files[game]?.rules

        return rules && key in rules ? rules[key] : files[Game.gh].rules[key]
    }

    enhancementCosts(game) {
        return this._ownOrGh(game, 'enhancements')
    }

    sectionsGh2() {
        return files[Game.gh2].sections
    }

    attackModifierDeck() {
        return allAttackModifierDecks
    }

    townGuard(game) {
        return files[game]?.townGuard || {}
    }

    alchemy(game) {
        return files[game]?.alchemy || []
    }

    // GH is played on the FC map (see games/gh.json).
    map(game = Game.gh) {
        const images = this._file(game).map.images

        return images && {...images}
    }

    mapSettings(game = Game.gh) {
        return {...this._file(game).map.settings}
    }

    storylineViewBox(game = Game.gh) {
        return {...this._file(game).map.viewBox}
    }

    _file(game) {
        return files[game] || files[Game.gh]
    }

    // FC is played inside a GH campaign and has no scenario, item or story data of its own.
    _playable(game) {
        return game === Game.fc ? files[Game.gh] : this._file(game)
    }

    _ownOrGh(game, key) {
        const own = files[game]?.[key]

        return own && Object.keys(own).length ? own : files[Game.gh][key]
    }
}
