<template>
    <modal ref="modal" title="Play Gloomhaven with a storyline tracker">
        <template v-slot:content>
            <p>To play Gloomhaven, my friends and I get together once a week. Hitting the pause
                button on our daily lives. Each one of us has delivered something to strengthen our joy in the game. My
                contribution is an interactive flowchart, to track our progress through the game and to make it easier
                to choose a new scenario to play. With some drinks and snacks, we are ready to begin.</p>
            <div class="m-4">
                <img src="img/minis.jpeg"/>
            </div>
        </template>
    </modal>
</template>

<script>
    export default {
        data() {
            return {}
        },
        mounted() {
            this.$bus.$on('open-about-us-modal', this.open);
        },
        methods: {
            open() {
                this.$refs['modal'].open();
            }
        }
    }
</script>
