<template>
    <a href="#" @click.prevent="navigateToPlayer" :class="{'cursor-default': !player}">
        <inline-svg v-if="svg"
                    :src="'characters/' + svg"
                    :classes="['h-full', 'w-full']"/>
        <span v-if="showName && name">
            {{ name }}
        </span>
    </a>
</template>

<script>
import GameData from "../../services/GameData";
import Helpers from "../../services/Helpers";

export default {
    props: {
        character: {
            type: Object | String
        },
        player: {
            type: Object,
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
        }
    },
    methods: {
        async navigateToPlayer(e) {
            if (this.player) {
                // Only navigate to characters page if not already there
                if (!this.$router.currentRoute.path.includes('/characters')) {
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
