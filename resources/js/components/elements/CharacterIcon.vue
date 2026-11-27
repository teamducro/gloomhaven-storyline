<template>
    <span @click="navigateToPlayer" :class="{'cursor-pointer': player, relative: editionBadge}">
        <inline-svg v-if="svg"
                    :src="'characters/' + svg"
                    :classes="['h-full', 'w-full']"/>
        <span v-if="editionBadge" class="edition-badge">{{ $t(editionBadge) }}</span>
        <span v-if="showName && name">
            {{ name }}
        </span>
    </span>
</template>

<script>
import GameData from "../../services/GameData";
import Character from "../../models/Character";
import SheetRepository from "../../repositories/SheetRepository";
import {Game} from "../../models/Game";

export default {
    emits: ['click'],
    props: {
        character: {
            type: [Character, String]
        },
        player: {
            type: [Object, String],
            default: null
        },
        showName: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            gameData: new GameData,
            svg: null
        }
    },
    mounted() {
        if (typeof this.character === 'object') {
            this.svg = this.character.id;
        } else {
            this.svg = this.character;
        }
    },
    computed: {
        name() {
            return typeof this.character === 'object'
                ? this.character.name
                : '';
        },
        // An added character of the Gloomhaven edition the campaign isn't playing, when both editions are allowed
        editionBadge() {
            const game = this.character?.game;
            const sheetRepository = new SheetRepository;
            if (typeof this.character !== 'object' || ![Game.gh, Game.gh2].includes(game)
                || !sheetRepository.data(Game.gh)?.bothEditions || game === sheetRepository.gloomhavenGame()) {
                return null;
            }

            return 'games-enabled.badge-' + game;
        }
    },
    methods: {
        async navigateToPlayer(e) {
            if (this.player) {
                e.preventDefault();

                // Only navigate to characters page if not already there
                if (!this.$route.path.includes('/characters')) {
                    await this.$router.push('/characters');
                }
                // Open the correct character sheet
                this.$bus.$emit('select-character', this.player);

                // Pass the click handler to the parent
                this.$emit('click', e);
            }
        }
    }
}
</script>

<style lang="scss">
.edition-badge {
    position: absolute;
    right: -8px;
    bottom: -5px;
    padding: 1px 3px;
    font: bold 10px Arial, sans-serif;
    line-height: 1;
    color: #fff;
    background: #3a3b3e;
    border: 1px solid #8a8a8a;
    border-radius: 6px;
}
</style>
