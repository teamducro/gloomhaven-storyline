<template>
    <div class="my-2"
         v-if="scenario.isComplete() && scenario.rewards.length">
        <h2 class="text-white">
            {{ $tc('Reward', rewards.length) }}
        </h2>
        <!--        <add-links-and-icons :text="scenario.rewards.join(', ')"/>-->
        <add-links-and-icons :text="rewards.join(', ')"/>
    </div>
</template>

<script>
import Scenario from "../../../models/Scenario";

export default {
    props: {
        scenario: Scenario
    },
    computed: {
        rewards() {
            return this.$t(this.scenario.translatedRewards);
        }
    },
    data() {
        return {}
    }
}
</script>
