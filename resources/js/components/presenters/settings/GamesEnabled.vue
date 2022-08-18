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
            <li v-for="code in games">
                <checkbox-with-label :id="code+'-enabled'"
                                     :label="$t(code)"
                                     :checked.sync="enabled[code]"
                                     :disabled="disabled[code]"
                                     @change="store"/>
            </li>
        </ul>
    </div>
</template>

<script>

import GameData from "../../../services/GameData";
import store from "store/dist/store.modern";

const md5 = require('js-md5');

export default {
    data() {
        return {
            games: [],
            enabled: {},
            disabled: {},
            listKey: '',
            beta: [],
        }
    },
    beforeMount() {
        this.init();
    },
    methods: {
        init() {
            const enabledGames = this.readEnabled();
            const gameData = new GameData;
            const beta = gameData.beta();
            this.games = gameData.games();
            this.games.forEach((code) => {
                this.enabled[code] = code in enabledGames ? enabledGames[code] : !beta.includes(code);
                this.disabled[code] = false;
            });
            this.checkDisabled();
        },
        getEnabled() {
            this.init();
            return this.emit();
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
        checkDisabled() {
            const enabled = collect(this.enabled).filter(v => v);
            if (enabled.count() === 1) {
                Vue.set(this.disabled, enabled.keys().first(), true);
            } else {
                Object.keys(this.disabled)
                    .forEach((code) => Vue.set(this.disabled, code, false));
            }
            this.rerender();
        },
        readEnabled() {
            return store.get('gamesEnabled', {});
        },
        rerender() {
            this.listKey = md5(JSON.stringify(this.disabled));
        },
        enabledAsArray() {
            return collect(this.enabled).filter(v => v).keys().toArray();
        }
    }
}
</script>
