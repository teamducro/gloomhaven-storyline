<template xmlns="http://www.w3.org/1999/html">
    <div ref="game-switch" class="game-switch mdc-select mdc-select--filled w-full"
         :class="{'with-transparency': withTransparency}">
        <span class="mdc-deprecated-list-item absolute z-1 pointer-events-none text-xs! -mt-2! text-white2-60!">
            {{ $t('Selected Game') }}
        </span>
        <div class="mdc-select__anchor w-full" role="button" aria-haspopup="listbox" aria-expanded="false">
            <span class="mdc-select__ripple"></span>
            <span class="mdc-select__selected-text-container">
                <span class="mdc-select__selected-text">
                    {{ current ? $t(current) : $t('gh') }}
                </span>
            </span>
            <select-dropdown-icon></select-dropdown-icon>
            <span class="mdc-line-ripple"></span>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface overflow-visible" style="min-width: 240px">
            <ul class="mdc-deprecated-list" role="listbox">
                <li role="option" v-for="code in games"
                    :key="code" :data-value="code"
                    class="mdc-deprecated-list-item cursor-pointer whitespace-nowrap flex items-center"
                    :aria-selected="current === code"
                    :class="[code, {'mdc-deprecated-list-item--selected': current === code}]">
                    <span class="mdc-deprecated-list-item__ripple"></span>
                    <span class="mdc-deprecated-list-item__text">{{ $t(code) }}</span>
                </li>
            </ul>
        </div>
        <purchase v-if="story" ref="purchase"
                  :story-id="story.id" :showTrigger="false"></purchase>
    </div>
</template>

<script>

import {MDCSelect} from "@material/select/component"
import GameData from "../../services/GameData"
import StoryRepository from "../../repositories/StoryRepository"
import SheetRepository from "../../repositories/SheetRepository"
import {Game} from "../../models/Game"

export default {
    inject: ['appData'],
    props: {
        withTransparency: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            current: null,
            story: null,
            games: [],
            storyRepository: new StoryRepository,
            sheetRepository: new SheetRepository,
            gameData: new GameData
        }
    },
    mounted() {
        this.$bus.$on('campaigns-changed', this.setCurrent)
        this.$bus.$on('game-selected', this.setSelected)
        this.$bus.$on('enabled-games-changed', this.setGames)

        this.select = new MDCSelect(this.$refs['game-switch'])
        this.select.listen('MDCSelect:change', this.selected)
    },
    updated() {
        // MDC caches option values and owns the selected text, so resync after Vue re-renders the options
        this.select.layoutOptions()
        this.select.setSelectedIndex(this.games.indexOf(this.current), true)
    },
    unmounted() {
        this.select?.destroy()

        this.$bus.$off('campaigns-changed', this.setCurrent)
        this.$bus.$off('game-selected', this.setSelected)
        this.$bus.$off('enabled-games-changed', this.setGames)
    },
    methods: {
        open() {
            document.querySelector('.game-switch .mdc-select__anchor').click()
        },
        setCurrent() {
            this.setGames()
            this.current = this.appData.game
            this.story = this.storyRepository.current()

            if (this.isNotAvailable(this.current)) {
                this.current = this.story.games[0]
                this.$bus.$emit('game-selected', this.current)
            }
        },
        setGames(enabledGames) {
            enabledGames = enabledGames || app.enabledGames
            const hidden = [...this.gameData.crossover(), this.sheetRepository.gloomhavenGame() === Game.gh2 ? Game.gh : Game.gh2]
            // gh2 is played in the gh slot, turning off gh hides both editions
            if (!enabledGames.includes(Game.gh)) {
                hidden.push(Game.gh2)
            }
            this.games = enabledGames.filter(code => !hidden.includes(code))
        },
        isNotAvailable(code) {
            const accessGame = this.gameData.accessGame(code)
            return this.story && this.gameData.purchasable().includes(accessGame) && !this.story?.games?.includes(accessGame)
        },
        selected(event) {
            const code = event?.detail?.value

            if (this.isNotAvailable(code)) {
                // This prevent this game from being selected
                this.setSelected(this.current)

                // The game is not purchased yet
                this.$refs.purchase.openExpandModal(code)
            }

            else if (this.current !== code) {
                this.$bus.$emit('game-selected', code)
            }
        },
        setSelected(code) {
            if (this.select.selectedIndex !== this.games.indexOf(code)) {
                this.select.selectedIndex = this.games.indexOf(code)
            }
        }
    }
}
</script>
