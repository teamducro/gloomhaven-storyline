<template>
    <modal ref="modal" :title="$t('games-enabled.which-edition')">
        <template v-slot:content>
            <div class="flex flex-col sm:flex-row gap-4">
                <button v-for="character in characters" :key="character.id" type="button"
                        :id="'choose-edition-' + character.id"
                        data-mdc-dialog-action="chosen"
                        class="flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border border-white2-25 hover:bg-black2-50 text-white"
                        @click="$emit('chosen', character.id, characters[0].id)">
                    <character-icon class="w-16" :character="character.id"/>
                    <span class="font-title text-lg">{{ $t(character.translatedName) }}</span>
                    <span class="text-sm text-white2-75">{{ $t(character.game) }}</span>
                </button>
            </div>
        </template>
        <template v-slot:buttons>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
                <span class="mdc-button__ripple"></span>
                <span class="mdc-button__label">{{ $t('Cancel') }}</span>
            </button>
        </template>
    </modal>
</template>

<script>
import CharacterRepository from "../../repositories/CharacterRepository";

export default {
    emits: ['chosen'],
    data() {
        return {
            characters: [],
            characterRepository: new CharacterRepository
        }
    },
    methods: {
        // ids: the campaign's edition first; 'chosen' also passes that id, the one the lists show
        open(ids) {
            const characters = this.characterRepository.get();
            this.characters = ids.map(id => characters.get(id));
            this.$refs['modal'].open();
        }
    }
}
</script>
