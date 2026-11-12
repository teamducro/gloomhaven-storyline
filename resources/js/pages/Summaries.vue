<template>
    <div class="pt-12 pb-4 px-2 sm:px-4 md:px-8">
        <div id="summaries" class="relative bg-dark-gray2-75 p-4 rounded-lg m-auto mt-4 max-w-party">
            <h1 class="text-xl mb-4">{{ $t('Story summaries') }}</h1>

            <p v-if="!arcs.length">{{ $t('Complete a scenario to start your story') }}</p>

            <section v-for="{quest, scenarios} in arcs" :key="quest.id" class="arc mb-8">
                <h2 class="font-title text-lg mb-2">{{ arcName(quest, scenarios) }}</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                    <scenario-number v-for="scenario in scenarios" :key="scenario.id"
                                     :scenario="scenario" :is-small="false"/>
                </div>
                <quest-summary :quest="quest"/>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            arcs: []
        }
    },
    mounted() {
        if (app.scenarios) {
            this.setArcs();
        }

        this.$bus.$on('scenarios-updated', this.setArcs);
    },
    unmounted() {
        this.$bus.$off('scenarios-updated', this.setArcs);
    },
    methods: {
        // Arcs in data order (the story order); an arc starts once one of its scenarios is complete.
        setArcs() {
            this.arcs = app.quests
                .filter(quest => quest.stage !== undefined)
                .map(quest => ({
                    quest,
                    scenarios: app.scenarios
                        .filter(scenario => scenario.isComplete() && scenario.quests.contains(q => q.id === quest.id))
                        .sortBy('id')
                        .toArray()
                }))
                .filter(arc => arc.scenarios.length)
                .toArray();
        },
        // Forgotten Circles arcs have no name; each covers a single scenario.
        arcName(quest, scenarios) {
            const name = this.$t(quest.name);

            return name.startsWith('quest') ? this.$t(scenarios[0].name) : name;
        }
    }
}
</script>
