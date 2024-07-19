<template>
    <span>
        <router-link v-if="scenarioLevel" to="party" data-mdc-dialog-action="close">
            <div class="font-title text-black text-sm ml-2 level-background text-center w-7"
                :ref="'scenario-level'">
                {{ scenarioLevel }}
            </div>
        </router-link>
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

import tippy from 'tippy.js';
import Scenario from '../../../models/Scenario';
import {Requirement} from '../../../models/Requirement';
import OverlayRepository from "../../../repositories/OverlayRepository";
import requirements from "./Requirements.vue";
import SheetRepository from "../../../repositories/SheetRepository";
import SheetCalculations from "../../../services/SheetCalculations";
export default {
    mixins: [SheetCalculations],
    inject: ['appData'],
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
            scenarioLevel: 0,
            overlayRepository: new OverlayRepository,
            sheetRepository: new SheetRepository(),
        };
    },
    mounted() {
        this.scenarioLevel = this.getScenarioLevel();

        // Show tooltip on hover
        this.$nextTick(() => {
            if (app.hasMouse) {
                this.showTooltip();
            }
        });
    },
    methods: {
        isRequired(requirement) {
            if (Requirement.manuallyUnlock(requirement)) {
                return this.scenario.isRequired();
            }

            return !this.overlayRepository.find(this.Requirement.overlayId(requirement)).present
        },
        getScenarioLevel() {
            const sheet = this.sheetRepository.make(this.appData.game);

            return this.calculateRecommendedLevel(sheet.characters) + (sheet.scenarioLevel || 0)
        },
        showTooltip() {
            const $el = this.$refs['scenario-level'];

            let table = '<table class="border-separate border-spacing-2">';
            const tableData = this.calculateDifficultyTable(this.scenarioLevel, this.appData.game)
            for (const row of Object.values(tableData)) {
                table += `<tr><td>${row.label}</td><td>${row.value}</td></tr>`;
            }
            table += '</table>';

            tippy($el, {
                content: table,
                allowHTML: true,
            });
        },
    }
}
</script>
<style scoped>
    .level-background {
        background-image: url( '/svg/icons/level-white.svg' );
        background-size: cover;
        background-position: 0 -3px;
    }
    .border-spacing-2 {
        border-spacing: 0.5rem 0.5rem;
    }
</style>
