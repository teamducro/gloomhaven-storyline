<template>
    <div class="my-2"
         v-if="scenario.isComplete() && scenario.rewards.isNotEmpty()">
        <h2 class="text-white">
            {{ $tc('Reward', rewards.length) }}
        </h2>
        <!--        <add-links-and-icons :text="scenario.rewards.join(', ')"/>-->
        <add-links-and-icons :text="rewards.join(', ')" class="inline-icons"/>
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

<style scoped lang="scss">
.inline-icons ::v-deep div, .inline-icons ::v-deep svg {
    display: inline;
}
</style>
