<template>
    <modal ref="modal" title="Credits">
        <template v-slot:content>
            <p class="mb-2">Thanks to these creators for their content.</p>
            <ul class="list-disc ml-4">
                <li class="py-1">
                    <span class="mr-1 block sm:inline">Gloomhaven assets by
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/Cephalofair">
                            Isaac Childres
                        </a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/thread/1733586/files-creation">
                        Files for creation
                    </a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">Chart layout by
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/grimtoothy">
                            Grimtoothy
                        </a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/filepage/177419/scenario-and-storyline-flowchart">
                        Scenario and Storyline Flowchart
                    </a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">Scenario summaries by
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/DoctorBandage">
                            DoctorBandage
                        </a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/geeklist/237840/gloomhaven-quest-log">
                        Gloomhaven Quest Log
                    </a>
                </li>
                <li class="py-1">
                    <span class="mr-1 block sm:inline">Map coordinates by
                        <a class="link" target="_blank" rel="noreferrer"
                           href="https://boardgamegeek.com/user/Dargalin">
                            Dargalin
                        </a>:
                    </span>
                    <a class="link" target="_blank" rel="noreferrer"
                       href="https://boardgamegeek.com/thread/1880969/online-tracker-campaign-party-and-characters">
                        Online map & campaign tracker
                    </a>
                </li>
            </ul>

            <p class="my-4">
                All content remains under creative commons license BY-NC-SA 4.0
                (<a class="link"
                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/">https://creativecommons.org/licenses/by-nc-sa/4.0/</a>)
            </p>
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
