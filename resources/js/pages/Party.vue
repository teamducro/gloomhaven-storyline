<template>
    <party-jotl v-if="game === 'jotl'"></party-jotl>
    <party-gh v-else></party-gh>
</template>

<script>

import PartyJotl from "./PartyJotl";
import PartyGh from "./PartyGh";

export default {
    components: {PartyJotl, PartyGh},
    data() {
        return {
            game: "gh"
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
