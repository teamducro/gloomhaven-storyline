<template>
    <div class="my-2"
         v-if="scenario.isComplete() && scenario.rewards.isNotEmpty()">
        <h2 class="text-white">
            {{ $tc('Reward', scenario.rewards.count()) }}
        </h2>
        <add-links-and-icons :text="scenario.rewards.join(', ')"/>
    </div>
</template>

<script>
import Scenario from "../../../models/Scenario";

export default {
    props: {
        scenario: Scenario
    },
    data() {
        return {}
    }
}
</script>
