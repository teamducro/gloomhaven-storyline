<template>
    <div class="mt-4 flex flex-col sm:flex-row">
        <div class="mb-8 sm:mb-0 sm:mr-4">
            <div class="mb-2 flex items-center">
                <slot name="title">
                    <h2>{{ $t('Reputation') }}</h2>
                </slot>
                <rollback v-show="!loading" ref="rollback"
                          :value.sync="sheet.reputation"></rollback>
            </div>
            <number-field :value.sync="sheet.reputation" :min="min" :max="max" :id="'reputation'"
                          @change="$emit('change')"></number-field>
        </div>
        <div v-if="hasShopModifier">
            <h2 class="mb-2">{{ $t('Shop modifier') }}</h2>
            <span class="font-title text-lg">{{ shop }} {{ $t('Gold') }}</span>
            <p class="text-sm">
                {{ $t('Modify the cost of items when buying by this amount.') }}
            </p>
        </div>
    </div>
</template>

<script>
import Sheet from "../../../models/Sheet";
import ScenarioRepository from "../../../repositories/ScenarioRepository";
import SheetCalculations from "../../../services/SheetCalculations";

export default {
    mixins: [SheetCalculations],
    props: {
        sheet: {
            type: Sheet,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        min: {
            type: Number,
            default: -20
        },
        max: {
            type: Number,
            default: 20
        },
        hasShopModifier: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            shop: this.calculateCostModifier(this.sheet.reputation),
            scenarioRepository: new ScenarioRepository
        }
    },
    watch: {
        'sheet.reputation': function () {
            this.shop = this.calculateCostModifier(this.sheet.reputation);
        }
    },
    methods: {
        reset() {
            this.$refs['rollback']?.reset();
        }
    }
}
</script>
