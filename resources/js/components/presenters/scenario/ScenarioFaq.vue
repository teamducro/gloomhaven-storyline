<template>
    <div class="my-2" v-if="entries.length">
        <h2 class="text-white">{{ $t('faq') }}</h2>
        <p v-for="(entry, index) in entries" :key="index" class="mb-2">{{ entry }}</p>
    </div>
</template>

<script>
import Scenario from "../../../models/Scenario";

export default {
    props: {
        scenario: Scenario
    },
    computed: {
        entries() {
            let entries = this.scenario.translatedFaq ? this.$t(this.scenario.translatedFaq) : [];
            // Conclusion entries would spoil the outcome, so they wait for completion.
            if (this.scenario.isComplete() && this.scenario.translatedConclusionFaq) {
                entries = entries.concat(this.$t(this.scenario.translatedConclusionFaq));
            }
            return entries;
        }
    }
}
</script>
