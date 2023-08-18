<template v-if="game">
    <party-fh v-if="game === 'fh'"></party-fh>
    <party-jotl v-else-if="game === 'jotl'"></party-jotl>
    <party-cs v-else-if="game === 'cs'"></party-cs>
    <party-gh v-else></party-gh>
</template>

<script>

import PartyJotl from "./PartyJotl";
import PartyGh from "./PartyGh";
import PartyCs from "./PartyCs";
import PartyFh from "./PartyFh";

export default {
    inject: ['appData'],
    components: {PartyFh, PartyJotl, PartyGh, PartyCs},
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
            this.game = this.appData.game;
        }
    }
}
</script>
