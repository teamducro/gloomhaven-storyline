// One game's static data (games/{game}.json). Every file has the same top-level keys.
export default class GameDataFile {
    constructor(data) {
        this.data = data
    }

    get scenarios() { return this.data.scenarios }
    get chapters() { return this.data.chapters }
    get regions() { return this.data.regions }
    get overlays() { return this.data.overlays }
    get buildings() { return this.data.buildings }
    get achievements() { return this.data.achievements }
    get quests() { return this.data.quests }
    get personalQuests() { return this.data.personalQuests }
    get items() { return this.data.items }
    get abilities() { return this.data.abilities }
    get characters() { return this.data.characters }
    get characterOrder() { return this.data.characterOrder }
    get attackModifierDecks() { return this.data.attackModifierDecks }
    get events() { return this.data.events }
    get townGuard() { return this.data.townGuard }
    get alchemy() { return this.data.alchemy }
    get classEvents() { return this.data.classEvents }
    get decks() { return this.data.decks }
    get prosperity() { return this.data.prosperity }
    get shop() { return this.data.shop }
    get rules() { return this.data.rules }
    get enhancements() { return this.data.enhancements }
    get sections() { return this.data.sections }
    get map() { return this.data.map }
}
