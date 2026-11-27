<template>
    <ul class="flex flex-row flex-wrap -mx-2">
        <template v-for="(checked, id) in sheet.characterUnlocks" :key="id">
            <li v-if="id in sheet.characterOrder && !otherEditionIds.includes(id)" class="flex items-center"
                :class="'order-'+sheet.characterOrder[id]"
                :title="characterTooltip(id)">
                <checkbox group="items"
                          :id="'character-'+id"
                          :checked="isUnlocked(id)"
                          :disabled="sheet.starterCharacters.includes(id)"
                          :title="characterTooltip(id)"
                          @change="(_, isChecked) => {unlockCharacter(id, isChecked)}"></checkbox>
                <label class="w-8 font-title" :for="'character-'+id" :title="characterTooltip(id)">
                    <character-icon class="w-6 -mb-2 inline-block" :character="id"/>
                </label>
            </li>
        </template>
    </ul>
</template>

<script>
import Sheet from "../../../models/Sheet";
import CampaignSheet from "../../../models/CampaignSheet";
import ScenarioRepository from "../../../repositories/ScenarioRepository";
import CharacterRepository from "../../../repositories/CharacterRepository";

export default {
    emits: ['changed'],
    props: {
        sheet: {
            type: [Sheet, CampaignSheet],
            required: true
        }
    },
    data() {
        return {
            characterRepository: new CharacterRepository,
            scenarioRepository: new ScenarioRepository
        }
    },
    computed: {
        characterNames() {
            const characters = this.characterRepository.get(this.sheet.game);
            return collect(characters).pluck('translatedName').items;
        },
        editionPairs() {
            return this.characterRepository.editionPairs();
        },
        otherEditionIds() {
            return Object.values(this.editionPairs);
        }
    },
    methods: {
        characterTooltip(id) {
            return this.isUnlocked(id)
                ? this.$t(this.characterNames[id])
                : this.$t('Locked');
        },
        // A class in both editions shows once, checked when either edition is unlocked
        isUnlocked(id) {
            return !!(this.sheet.characterUnlocks[id] || this.sheet.characterUnlocks[this.editionPairs[id]]);
        },
        unlockCharacter(id, isChecked) {
            this.sheet.characterUnlocks[id] = isChecked;
            if (this.editionPairs[id]) {
                this.sheet.characterUnlocks[this.editionPairs[id]] = isChecked;
            }
            if (isChecked) {
                this.sheet.addClassEvents(id, 'unlock');
            }
            this.sheet.store();
            this.scenarioRepository.scenarioValidator.validate();
            this.$emit('changed', id, isChecked)
        },
    }
}
</script>
