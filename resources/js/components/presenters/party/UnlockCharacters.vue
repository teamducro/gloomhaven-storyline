<template>
    <ul class="flex flex-row flex-wrap -mx-2">
        <li v-for="(checked, id) in sheet.characterUnlocks" :key="id" class="flex items-center"
            :class="'order-'+sheet.characterOrder[id]">
            <checkbox group="items"
                      :id="'character-'+id"
                      :checked="checked"
                      :disabled="sheet.starterCharacters.includes(id)"
                      @change="(_, isChecked) => {unlockCharacter(id, isChecked)}"></checkbox>
            <label class="w-8 font-title" :for="'character-'+id">
                <character-icon class="w-6 -mb-2 inline-block" :character="id"/>
            </label>
        </li>
    </ul>
</template>

<script>
import Sheet from "../../../models/Sheet";
import ScenarioRepository from "../../../repositories/ScenarioRepository";

export default {
    props: {
        sheet: {
            type: Sheet,
            required: true
        }
    },
    data() {
        return {
            scenarioRepository: new ScenarioRepository
        }
    },
    methods: {
        unlockCharacter(id, isChecked) {
            this.sheet.characterUnlocks[id] = isChecked;
            this.sheet.store();
            this.scenarioRepository.scenarioValidator.validate();
            this.$emit('changed')
        },
    }
}
</script>
