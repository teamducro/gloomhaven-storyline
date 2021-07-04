<template>
    <inline-svg v-if="svg"
                :src="'characters/' + svg"
                :classes="['h-full', 'w-full']"/>
</template>

<script>
import GameData from "../../services/GameData";
import Helpers from "../../services/Helpers";

export default {
    props: [
        'character'
    ],
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
    }
}
</script>
