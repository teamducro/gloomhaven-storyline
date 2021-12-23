<template xmlns="http://www.w3.org/1999/html">
    <div ref="game-switch" class="game-switch mdc-select w-full"
         :class="{'with-transparency': withTransparency}">
        <span class="mdc-list-item absolute z-1 pointer-events-none !text-xs !-mt-2 !text-white2-60">
            {{ $t('Selected Game') }}
        </span>
        <div class="mdc-select__anchor w-full">
            <i class="mdc-select__dropdown-icon"></i>
            <div class="mdc-select__selected-text">
                {{ current ? games[current] : games.gh }}
            </div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface overflow-visible" style="min-width: 240px">
            <ul class="mdc-list">
                <li v-for="(name, code) in games"
                    :key="code" :data-value="code"
                    class="mdc-list-item cursor-pointer whitespace-nowrap flex items-center"
                    :aria-selected="current === code"
                    :class="[code + (current === code ? 'mdc-list-item--selected': '')]">
                    {{ games[code] }}
                    <bedge v-if="beta.includes(code)" class="small white ml-2">BETA</bedge>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import {MDCSelect} from "@material/select/component";

export default {
    props: {
        withTransparency: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            current: null,
            games: {
                gh: this.$t('Gloomhaven'),
                fc: this.$t('Forgotten Circles'),
                jotl: this.$t('Jaws of the Lion'),
            },
            beta: ['jotl']
        }
    },
    mounted() {
        this.setCurrent();
        this.$bus.$on('campaigns-changed', this.setCurrent);

        this.select = new MDCSelect(this.$refs['game-switch']);
        this.select.listen('MDCSelect:change', this.selected);
    },
    destroyed() {
        this.select?.destroy();

        this.$bus.$off('campaigns-changed', this.setCurrent);
    },
    methods: {
        open() {
            document.querySelector('.game-switch .mdc-select__selected-text').click();
        },
        setCurrent() {
            this.current = app.game;
        },
        selected(event) {
            const code = event?.detail?.value;
            if (this.current !== code) {
                this.$bus.$emit('game-selected', code);
            }
        }
    }
}
</script>
