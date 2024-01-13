<template>
    <span>
        <webp v-if="scenario.has_boss" src="/img/icons/general/boss.png" width="16" class="ml-2"/>
        <inline-svg v-if="scenario.requirements.includes(Requirement.boat)" src="icons/boat" class="ml-2"/>
        <inline-svg v-if="scenario.requirements.includes(Requirement.sled)" src="icons/sled" class="ml-2"/>
        <inline-svg v-if="scenario.requirements.includes(Requirement.rope)" src="icons/climbing-gear" class="ml-2"/>
    </span>
</template>
<script>
import Scenario from "../../../models/Scenario";
import {Requirement} from "../../../models/Requirement";

export default {
    computed: {
        Requirement() {
            return Requirement
        }
    },
    props: {
        scenario: {
            type: Scenario
        }
    },
    data() {
        return {};
    }
}
</script>
