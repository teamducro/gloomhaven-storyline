<template>
    <ul class="flex flex-row flex-wrap -mx-2">
        <li v-for="(checked, id) in sheet.characterUnlocks" :key="id" class="flex items-center"
            :class="'order-'+sheet.characterOrder[id]"
            :title="characterTooltip(id)">
            <checkbox group="items"
                      :id="'character-'+id"
                      :checked="checked"
                      :disabled="sheet.starterCharacters.includes(id)"
                      :title="characterTooltip(id)"
                      @change="(_, isChecked) => {unlockCharacter(id, isChecked)}"></checkbox>
            <label class="w-8 font-title" :for="'character-'+id" :title="characterTooltip(id)">
                <character-icon class="w-6 -mb-2 inline-block" :character="id"/>
            </label>
        </li>
    </ul>
</template>

<script>
import Sheet from "../../../models/Sheet";
import CampaignSheet from "../../../models/CampaignSheet";
import ScenarioRepository from "../../../repositories/ScenarioRepository";
import CharacterRepository from "../../../repositories/CharacterRepository";

export default {
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
        }
    },
    methods: {
        characterTooltip(id) {
            return this.sheet.characterUnlocks[id]
                ? this.$t(this.characterNames[id])
                : this.$t('Locked');
        },
        unlockCharacter(id, isChecked) {
            this.sheet.characterUnlocks[id] = isChecked;
            this.sheet.store();
            this.scenarioRepository.scenarioValidator.validate();
            this.$emit('changed')
        },
    }
}
</script>
