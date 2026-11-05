<template>
    <div id="games-enabled"
         class="bg-dark-gray2-75 p-4 rounded-lg m-auto mt-8 w-full max-w-3xl">
        <h1 class="text-2xl sm:text-3xl mb-4 text-center md:text-left flex items-center">
            <i class="material-icons mr-4" aria-hidden="true">apps</i>
            {{ $t('games-enabled.title') }}
        </h1>

        <p class="text-base">
            {{ $t('games-enabled.text') }}
        </p>

        <ul :key="listKey">
            <li v-for="code in games.filter(code => code !== Game.gh2)">
                <checkbox-with-label :id="code+'-enabled'"
                                     :label="$t(code)"
                                     v-model:checked="enabled[code]"
                                     :disabled="disabled[code]"
                                     :auto-disable="false"
                                     @change="toggle(code)"/>
                <div v-if="code === Game.gh && enabled[Game.gh]" id="gloomhaven-edition" class="ml-10 mb-2">
                    <radio v-for="edition in [Game.gh, Game.gh2]"
                           :key="edition"
                           :id="edition + '-edition'"
                           group="gloomhaven-edition"
                           :label="$t(edition)"
                           :checked="currentEdition === edition"
                           @changed="selectEdition(edition)"/>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

import GameData from "../../../services/GameData";
import store from "store/dist/store.modern";

import md5 from 'js-md5';
import {Game} from "../../../models/Game";
import Sheet from "../../../models/Sheet";
import SheetRepository from "../../../repositories/SheetRepository";

export default {
    data() {
        return {
            games: [],
            enabled: {},
            disabled: {},
            listKey: '',
            currentEdition: null,
            sheetRepository: new SheetRepository,
        }
    },
    computed: {
        Game() {
            return Game
        }
    },
    beforeMount() {
        this.init();
    },
    mounted() {
        this.setEdition();
        this.$bus.$on('campaigns-changed', this.setEdition);
    },
    unmounted() {
        this.$bus.$off('campaigns-changed', this.setEdition);
    },
    methods: {
        init() {
            const enabledGames = this.readEnabled();
            const gameData = new GameData;
            this.games = gameData.games();
            this.games.forEach((code) => {
                // GH is always enabled, it's used as default in some places
                if (code === 'gh') {
                    this.enabled[code] = true;
                    this.disabled[code] = true;
                } else {
                    this.enabled[code] = code in enabledGames ? enabledGames[code] : gameData.enabledByDefault(code);
                    this.disabled[code] = false;
                }
            });
            this.checkDisabled();
        },
        getEnabled() {
            this.init();
            return this.emit();
        },
        enableGame(game) {
            this.init();
            this.enabled[game] = true;
            this.store();
            return this.emit();
        },
        toggle(code) {
            this.store();
            // Crossover content is merged in when campaign data is fetched
            if (new GameData().crossover().includes(code)) {
                app.campaignsChanged();
            }
        },
        store() {
            store.set('gamesEnabled', this.enabled);
            this.emit();
            this.checkDisabled();
        },
        emit() {
            const games = this.enabledAsArray();
            this.$bus.$emit('enabled-games-changed', games);

            return games;
        },
        // gh and gh2 are separate games, the campaign picks which one is played as Gloomhaven
        selectEdition(game) {
            const sheet = new Sheet({game: Game.gh});
            sheet.edition = game === Game.gh2 ? 2 : 1;
            sheet.store();

            if ([Game.gh, Game.gh2].includes(app.game)) {
                this.$bus.$emit('game-selected', game);
            } else {
                this.$bus.$emit('campaign-selected', app.campaignId);
            }
        },
        setEdition() {
            this.currentEdition = this.sheetRepository.gloomhavenGame();
            // Loading a campaign may enable gh2, re-read so store() doesn't overwrite it
            this.init();
        },
        checkDisabled() {
            const enabled = collect(this.enabled).filter(v => v);
            if (enabled.count() === 1) {
                this.disabled[enabled.keys().first()] = true;
            } else {
                Object.keys(this.disabled)
                    .forEach((code) => this.disabled[code] = false);
            }
            // The current game is always disabled, gh2 is played in the gh slot
            this.disabled[app.game] = true;
            if (app.game === Game.gh2) {
                this.disabled[Game.gh] = true;
            }
            this.rerender();
        },
        readEnabled() {
            return store.get('gamesEnabled', {});
        },
        rerender() {
            this.listKey = md5(JSON.stringify(this.disabled) + this.currentEdition);
        },
        enabledAsArray() {
            return collect(this.enabled).filter(v => v).keys().toArray();
        }
    }
}
</script>
