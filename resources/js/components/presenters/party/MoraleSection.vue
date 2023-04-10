<template>
    <div class="mt-4 flex flex-col sm:flex-row">
        <div class="mb-8 sm:mb-0 sm:mr-4">
            <div class="mb-2 flex items-center">
                <slot name="title">
                    <h2>{{ $t('Morale') }}</h2>
                </slot>
                <rollback :loading="loading" ref="rollback"
                          :value.sync="sheet.morale"/>
            </div>
            <number-field :value.sync="sheet.morale" :min="min" :max="max" id="morale"
                          @change="$emit('change')"/>
        </div>
        <div>
            <h2 class="mb-2">{{ $t('Defense') }}</h2>
            <span v-if="sheet.morale > 0" class="font-title text-lg">{{ defense >= 0 ? '+'+defense : defense }}</span>
        </div>
    </div>
</template>

<script>
import Sheet from "../../../models/Sheet";
import ScenarioRepository from "../../../repositories/ScenarioRepository";
import SheetCalculations from "../../../services/SheetCalculations";
import CampaignSheet from "../../../models/CampaignSheet";

export default {
    mixins: [SheetCalculations],
    props: {
        sheet: {
            type: Sheet|CampaignSheet,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            defense: this.calculateDefense(this.sheet.morale),
            scenarioRepository: new ScenarioRepository
        }
    },
    watch: {
        'sheet.morale': function () {
            this.defense = this.calculateDefense(this.sheet.morale);
        }
    },
    methods: {
        reset() {
            this.$refs['rollback']?.reset();
        }
    }
}
</script>
