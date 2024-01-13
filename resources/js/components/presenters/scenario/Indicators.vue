<template>
    <span>
        <webp v-if="scenario.has_boss" src="/img/icons/general/boss.png" width="16" class="ml-2 boss"/>
        <router-link v-if="scenario.getCompleteRequirements().some(requirement => Requirement.requirements().includes(requirement))"
                     to="/buildings" class="outline-none flex items-center" data-mdc-dialog-action="close">
            <template v-for="requirement in Requirement.requirements()">
                <span v-if="scenario.isRequiredBy(requirement)" class="relative">
                    <span v-if="isRequired(requirement)" class="absolute text-xs font-bold text-required ml-1 -mt-1">!</span>
                    <inline-svg :src="'icons/'+requirement" class="ml-2"/>
                </span>
            </template>
        </router-link>
    </span>
</template>
<script>
import Scenario from '../../../models/Scenario';
import {Requirement} from '../../../models/Requirement';
import OverlayRepository from "../../../repositories/OverlayRepository";
export default {
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
            return !this.overlayRepository.find(this.Requirement.overlayId(requirement)).present
        }
    }
}
</script>
