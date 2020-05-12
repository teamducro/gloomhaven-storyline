<template>
    <modal ref="modal" title="Credits">
        <template v-slot:content>
            <p class="mb-2">Thanks to these creators for their content.</p>
            <ul class="list-disc ml-4">
                <li class="py-1">
                    <span class="mr-1 block sm:inline">Chart layout by
                        <a class="link" href="https://boardgamegeek.com/user/grimtoothy" target="_blank">Grimtoothy</a>:
                    </span>
                    <a class="link" target="_blank"
                       href="https://boardgamegeek.com/filepage/177419/scenario-and-storyline-flowchart">
                        Scenario and Storyline Flowchart
                    </a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">Scenario summaries by
                        <a class="link" href="https://boardgamegeek.com/user/DoctorBandage" target="_blank">DoctorBandage</a>:
                    </span>
                    <a class="link" target="_blank"
                       href="https://boardgamegeek.com/geeklist/237840/gloomhaven-quest-log">
                        Gloomhaven Quest Log
                    </a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">Map coordinates by
                        <a class="link" href="https://boardgamegeek.com/user/Dargalin"
                           target="_blank">Dargalin</a>:
                    </span>
                    <a class="link" target="_blank"
                       href="https://boardgamegeek.com/thread/1880969/online-tracker-campaign-party-and-characters">
                        Online map & campaign tracker
                    </a>
                </li>
            </ul>
        </template>
    </modal>
</template>

<script>
    export default {
        data() {
            return {}
        },
        mounted() {
            this.$bus.$on('open-credits-modal', this.open);
        },
        methods: {
            open() {
                this.$refs['modal'].open();
            }
        }
    }
</script>
