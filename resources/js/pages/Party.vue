<template v-if="game">
    <party-jotl v-if="game === 'jotl'"></party-jotl>
    <party-cs v-else-if="game === 'cs'"></party-cs>
    <party-gh v-else></party-gh>
</template>

<script>

import PartyJotl from "./PartyJotl";
import PartyGh from "./PartyGh";
import PartyCs from "./PartyCs";

export default {
    components: {PartyJotl, PartyGh, PartyCs},
    data() {
        return {
            game: null
        }
    },
    mounted() {
        this.render();

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    methods: {
        async render() {
            this.game = app.game;
        }
    }
}
</script>
