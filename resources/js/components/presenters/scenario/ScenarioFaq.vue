<template>
    <!-- Shown after completion: FAQ entries can spoil the conclusion. -->
    <div class="my-2" v-if="scenario.isComplete() && scenario.translatedFaq">
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
            return this.$t(this.scenario.translatedFaq);
        }
    }
}
</script>
