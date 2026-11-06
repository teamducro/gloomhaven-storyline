<template>
    <div class="w-full mt-8">
        <div class="mb-2 flex items-center">
            <slot name="title">
                <h2>{{ $t('Sanctuary of the Great Oak') }}</h2>
            </slot>
            <rollback :loading="loading" ref="rollback"
                      v-model:value="sheet.donations"/>
        </div>
        <number-field v-model:value="sheet.donations" :min="min" :step="step" :id="'donations'"
                      @change="$emit('change')"></number-field>
        <p v-if="threshold && sheet.donations <= threshold" class="mt-2 text-sm">
            <slot name="threshold">
                {{ $t('When 100 gold is donated, open envelope') }} <span class="font-title">B</span>
            </slot>
        </p>
        <p class="mt-2" v-if="donationProsperity">
            <span class="font-title">{{ donationProsperity }}</span>
            {{
                donationProsperity === 1
                    ? $t('gained prosperity checkbox by donations.')
                    : $t('gained prosperity checkboxes by donations.')
            }}
        </p>
        <checkbox-with-label id="auto-donation-prosperity"
                             class="mt-2 -ml-2"
                             :label="$t('Check donation prosperity checkboxes automatically')"
                             v-model:checked="sheet.autoDonationProsperity"
                             @change="$emit('change')"/>
    </div>
</template>

<script>
import Sheet from "../../../models/Sheet";
import ScenarioRepository from "../../../repositories/ScenarioRepository";
import SheetCalculations from "../../../services/SheetCalculations";

export default {
    emits: ['change'],
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
            default: 0
        },
        step: {
            type: Number,
            default: 10
        },
        max: {
            type: Number,
            default: 20
        },
        threshold: {
            type: Number,
            default: 100
        },
    },
    data() {
        return {
            donationProsperity: this.calculateDonationProsperity(this.sheet.donations, this.sheet.game),
            scenarioRepository: new ScenarioRepository
        }
    },
    watch: {
        'sheet.donations': function () {
            this.donationProsperity = this.calculateDonationProsperity(this.sheet.donations, this.sheet.game);
        }
    },
    methods: {
        reset() {
            this.$refs['rollback']?.reset();
        }
    }
}
</script>
