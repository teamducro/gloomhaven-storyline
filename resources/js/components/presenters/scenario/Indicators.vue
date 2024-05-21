<template>
    <span>
        <webp v-if="scenario.has_boss" src="/img/icons/general/boss.png" width="16" class="ml-2 boss"/>
        <router-link v-for="requirement in Requirement.requirements()" :key="'requirement-link-' + requirement"
                     :to="Requirement.page(requirement)" class="outline-none flex items-center" data-mdc-dialog-action="close">
            <span v-if="scenario.isRequiredBy(requirement)" class="relative">
                <span v-if="isRequired(requirement)" class="absolute text-xs font-bold text-required ml-1 -mt-1">!</span>
                <inline-svg :src="'icons/'+requirement" class="ml-2"/>
            </span>
        </router-link>
    </span>
</template>
<script>
import Scenario from '../../../models/Scenario';
import {Requirement} from '../../../models/Requirement';
import OverlayRepository from "../../../repositories/OverlayRepository";
import requirements from "./Requirements.vue";
import {Game} from "../../../models/Game";
export default {
    computed: {
        requirements() {
            return requirements
        }
    },
    props: {
        scenario: {
            type: Scenario
        }
    },
    data() {
        return {
            Requirement: Requirement,
            overlayRepository: new OverlayRepository,
        };
    },
    methods: {
        isRequired(requirement) {
            if (Requirement.manuallyUnlock(requirement)) {
                return this.scenario.isRequired();
            }

            return !this.overlayRepository.find(this.Requirement.overlayId(requirement)).present
        }
    }
}
</script>
