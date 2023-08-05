<template xmlns="http://www.w3.org/1999/html">
    <div ref="game-switch" class="game-switch mdc-select w-full"
         :class="{'with-transparency': withTransparency}">
        <span class="mdc-list-item absolute z-1 pointer-events-none !text-xs !-mt-2 !text-white2-60">
            {{ $t('Selected Game') }}
        </span>
        <div class="mdc-select__anchor w-full">
            <i class="mdc-select__dropdown-icon"></i>
            <div class="mdc-select__selected-text">
                {{ current ? $t(current) : $t('gh') }}
            </div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface overflow-visible" style="min-width: 240px">
            <ul class="mdc-list">
                <li v-for="code in games"
                    :key="code" :data-value="code"
                    class="mdc-list-item cursor-pointer whitespace-nowrap flex items-center"
                    :aria-selected="current === code"
                    :class="[code + (current === code ? 'mdc-list-item--selected': '')]">
                    {{ $t(code) }}
                    <bedge v-if="beta.includes(code)" class="small white ml-2">BETA</bedge>
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
            beta: [],
            storyRepository: new StoryRepository,
            gameData: new GameData
        }
    },
    mounted() {
        this.beta = this.gameData.beta()
        this.$bus.$on('campaigns-changed', this.setCurrent)
        this.$bus.$on('game-selected', this.setSelected)
        this.$bus.$on('enabled-games-changed', this.setGames)

        this.select = new MDCSelect(this.$refs['game-switch'])
        this.select.listen('MDCSelect:change', this.selected)
    },
    destroyed() {
        this.select?.destroy()

        this.$bus.$off('campaigns-changed', this.setCurrent)
        this.$bus.$off('game-selected', this.setSelected)
        this.$bus.$off('enabled-games-changed', this.setGames)
    },
    methods: {
        open() {
            document.querySelector('.game-switch .mdc-select__selected-text').click()
        },
        setCurrent() {
            this.current = this.appData.game
            this.story = this.storyRepository.current()

            if (this.isNotAvailable(this.current)) {
                this.current = this.story.games[0]
                this.$bus.$emit('game-selected', this.current)
            }
        },
        setGames(enabledGames) {
            this.games = enabledGames || app.enabledGames
        },
        isNotAvailable(code) {
            return this.story && this.gameData.purchasable().includes(code) && !this.story?.games.includes(code)
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
